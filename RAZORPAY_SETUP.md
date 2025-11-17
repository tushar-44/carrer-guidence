# Razorpay Payment Integration Setup Guide

## ✅ Implementation Complete

Razorpay payment integration has been implemented for professional mentor bookings. Near-peer mentors have free sessions (no payment required).

## 📁 Files Created/Modified

### New Files:
1. **`src/lib/payments/razorpay.ts`** - Razorpay SDK integration
2. **`supabase/functions/payments/index.ts`** - Payment backend function

### Modified Files:
1. **`src/components/mentors/BookingModal.tsx`** - Added payment step

## 🔧 Setup Instructions

### 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a Razorpay account
3. Complete KYC verification
4. Get your API keys from Dashboard → Settings → API Keys

### 2. Add Environment Variables

#### Frontend (.env file):
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx  # Your Razorpay Key ID
```

#### Supabase Secrets (for Edge Functions):
```bash
# Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here  # Optional, for webhooks
```

### 3. Deploy Supabase Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the payment function
supabase functions deploy payments
```

### 4. Configure Razorpay Webhook (Optional but Recommended)

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-project.supabase.co/functions/v1/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret and add it to Supabase secrets

## 🧪 Testing

### Test Mode:
- Use Razorpay test keys (start with `rzp_test_`)
- Test cards: https://razorpay.com/docs/payments/test-cards/

### Test Flow:
1. Book a session with a professional mentor (hourlyRate > 0)
2. Complete booking details
3. Click "Proceed to Payment"
4. Use test card: `4111 1111 1111 1111`
5. CVV: Any 3 digits
6. Expiry: Any future date

## 💰 Payment Flow

1. **User books session** → Creates booking with `payment_status: 'pending'`
2. **Payment step** → User clicks "Pay ₹X"
3. **Razorpay popup** → User enters payment details
4. **Payment verification** → Backend verifies signature
5. **Database update** → Booking status → `confirmed`, Payment record created
6. **Success** → User sees confirmation

## 🔒 Security Features

- ✅ Payment signature verification
- ✅ Webhook signature verification
- ✅ Secure API key storage (Supabase secrets)
- ✅ User authentication required
- ✅ Payment records stored in database

## 📊 Database Tables Used

- **`bookings`** - Stores booking with payment_status
- **`payments`** - Stores payment records with Razorpay details

## 🐛 Troubleshooting

### Payment popup not opening:
- Check if Razorpay script loaded: `window.Razorpay` should exist
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly

### Payment verification fails:
- Check Razorpay key secret in Supabase secrets
- Verify signature calculation matches Razorpay format

### Webhook not working:
- Check webhook URL is correct
- Verify webhook secret matches Razorpay dashboard
- Check Supabase function logs

## 📝 Notes

- **Near-peer mentors** (mentor_type: 'near-peer') have **FREE** sessions
- **Professional mentors** require payment
- All amounts are in **INR (₹)**
- Payment amounts are stored in **paise** (smallest currency unit) in Razorpay
- Database stores amounts in **rupees** (converted from paise)

---

**Status:** ✅ Ready for testing (requires Razorpay account setup)

