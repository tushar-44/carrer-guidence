// Razorpay Payment Integration
// For Indian payment gateway

interface RazorpayOptions {
  key: string;
  amount: number; // in paise (smallest currency unit)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order (call your backend)
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR',
  bookingId?: string
): Promise<{ orderId: string; amount: number }> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession());

  if (!session) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/payments/create-order`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to paise
      currency,
      booking_id: bookingId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  const data = await response.json();
  return {
    orderId: data.order_id,
    amount: data.amount,
  };
};

// Initialize Razorpay payment
export const initiatePayment = async (
  options: Omit<RazorpayOptions, 'key' | 'handler'>
): Promise<RazorpayResponse> => {
  await loadRazorpayScript();

  const Razorpay = (window as any).Razorpay;
  if (!Razorpay) {
    throw new Error('Razorpay SDK failed to load');
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('Razorpay Key ID not configured');
  }

  return new Promise((resolve, reject) => {
    const razorpayOptions: RazorpayOptions = {
      ...options,
      key: keyId,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new Razorpay(razorpayOptions);
    razorpay.open();
  });
};

// Verify payment signature (call your backend)
export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string,
  bookingId?: string
): Promise<boolean> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession());

  if (!session) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/payments/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      booking_id: bookingId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Payment verification failed');
  }

  const data = await response.json();
  return data.verified === true;
};

// Process payment for a booking
export const processBookingPayment = async (
  amount: number,
  mentorName: string,
  bookingId: string,
  userEmail?: string,
  userName?: string
): Promise<RazorpayResponse> => {
  // Create order first
  const { orderId } = await createRazorpayOrder(amount, 'INR', bookingId);

  // Initiate payment
  const paymentResponse = await initiatePayment({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    name: 'CareerPath',
    description: `Mentoring session with ${mentorName}`,
    order_id: orderId,
    prefill: {
      email: userEmail,
      name: userName,
    },
    theme: {
      color: '#3b82f6', // Blue theme
    },
  });

  // Verify payment
  await verifyPayment(
    paymentResponse.razorpay_payment_id,
    paymentResponse.razorpay_order_id,
    paymentResponse.razorpay_signature,
    bookingId
  );

  return paymentResponse;
};

