import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Razorpay API credentials (set in Supabase secrets)
const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    // Get the current user from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const method = req.method
    const path = url.pathname.split('/').pop()

    // Create Razorpay Order
    if (method === 'POST' && path === 'create-order') {
      const { amount, currency = 'INR', booking_id } = await req.json()

      if (!amount || amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return new Response(
          JSON.stringify({ error: 'Razorpay credentials not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create order via Razorpay API
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Already in paise
          currency: currency,
          receipt: `booking_${booking_id || Date.now()}`,
          notes: {
            booking_id: booking_id,
            user_id: user.id,
          },
        }),
      })

      if (!razorpayResponse.ok) {
        const error = await razorpayResponse.json()
        return new Response(
          JSON.stringify({ error: error.error?.description || 'Failed to create order' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const orderData = await razorpayResponse.json()

      return new Response(
        JSON.stringify({
          order_id: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify Payment
    if (method === 'POST' && path === 'verify') {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, booking_id } = await req.json()

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return new Response(
          JSON.stringify({ error: 'Missing payment details' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify signature using Web Crypto API
      const textEncoder = new TextEncoder()
      const message = `${razorpay_order_id}|${razorpay_payment_id}`
      const secret = RAZORPAY_KEY_SECRET || ''
      
      // Use Web Crypto API for HMAC
      const key = await crypto.subtle.importKey(
        'raw',
        textEncoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      
      const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(message))
      const hashArray = Array.from(new Uint8Array(signature))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      const isValid = hashHex === razorpay_signature

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'Invalid payment signature', verified: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Fetch payment details from Razorpay
      const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
        },
      })

      if (!paymentResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to verify payment', verified: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const paymentData = await paymentResponse.json()

      if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
        return new Response(
          JSON.stringify({ error: 'Payment not successful', verified: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Save payment to database
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          booking_id: booking_id || null,
          amount: paymentData.amount / 100, // Convert from paise to rupees
          currency: paymentData.currency,
          payment_method: 'razorpay',
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: 'completed',
          metadata: paymentData,
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Error saving payment:', paymentError)
        // Payment is verified but saving failed - still return success
      }

      // Update booking payment status if booking_id exists
      if (booking_id) {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            payment_id: paymentRecord?.id || null,
            status: 'confirmed',
          })
          .eq('id', booking_id)
      }

      return new Response(
        JSON.stringify({
          verified: true,
          payment_id: paymentRecord?.id,
          payment_data: paymentData,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Webhook handler (for Razorpay webhooks)
    if (method === 'POST' && path === 'webhook') {
      const webhookSignature = req.headers.get('X-Razorpay-Signature')
      const body = await req.text()

      if (!webhookSignature || !RAZORPAY_WEBHOOK_SECRET) {
        return new Response(
          JSON.stringify({ error: 'Webhook verification failed' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify webhook signature using Web Crypto API
      const textEncoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw',
        textEncoder.encode(RAZORPAY_WEBHOOK_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      
      const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(body))
      const hashArray = Array.from(new Uint8Array(signature))
      const hmac = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      if (hmac !== webhookSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const webhookData = JSON.parse(body)
      const event = webhookData.event
      const paymentData = webhookData.payload?.payment?.entity

      if (event === 'payment.captured' && paymentData) {
        // Update payment status in database
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            metadata: paymentData,
          })
          .eq('razorpay_payment_id', paymentData.id)

        // Update booking if exists
        const bookingId = paymentData.notes?.booking_id
        if (bookingId) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
            })
            .eq('id', bookingId)
        }
      }

      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

