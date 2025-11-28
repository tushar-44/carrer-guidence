# 💳 Payment Integration Testing Guide

**Last Updated:** January 27, 2025  
**Status:** Ready for Testing

---

## ✅ Payment Setup Complete

### Environment Variables Configured
```env
VITE_RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
VITE_RAZORPAY_KEY_SECRET=r0LNYjZuse4URVj6LMcbXxHt
```

### Supabase Edge Function
- **Function:** `supabase/functions/payments/index.ts`
- **Status:** ✅ Code ready, needs deployment
- **Endpoints:**
  - `POST /payments/create-order` - Create Razorpay order
  - `POST /payments/verify` - Verify payment signature
  - `POST /payments/webhook` - Handle Razorpay webhooks

---

## 🧪 Testing Steps

### 1. Deploy Payment Function to Supabase

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link to your project
supabase link --project-ref axxkzhcavbqcooevayyn

# Set Razorpay secrets in Supabase
supabase secrets set RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
supabase secrets set RAZORPAY_KEY_SECRET=r0LNYjZuse4URVj6LMcbXxHt

# Deploy the payment function
supabase functions deploy payments
```

### 2. Test Payment Flow

#### Step 1: Navigate to Mentor Detail Page
1. Start dev server: `npm run dev`
2. Go to `http://localhost:5173/mentors`
3. Click on any **professional mentor** (not near-peer)

#### Step 2: Book a Session
1. Click "Book Session" button
2. **Step 1:** Select a date from calendar
3. **Step 2:** Select a time slot
4. **Step 3:** Fill in session details:
   - Duration: 30 min / 1 hour / 1.5 hours
   - Topic: Enter session topic
   - Notes: Optional notes
5. Click "Proceed to Payment"

#### Step 3: Complete Payment
1. Razorpay modal should open
2. Use **test card details**:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: Any future date (e.g., 12/25)
   Name: Test User
   ```
3. Click "Pay" button
4. Payment should succeed

#### Step 4: Verify Success
1. Check for success toast message
2. Verify booking confirmation modal
3. Check Supabase dashboard:
   - `bookings` table should have new entry
   - `payments` table should have payment record
   - `payment_status` should be 'paid'
   - `status` should be 'confirmed'

---

## 🧪 Test Scenarios

### Scenario 1: Successful Payment (Professional Mentor)
- **Mentor Type:** Professional (has hourly_rate)
- **Expected:** Payment modal opens, payment succeeds
- **Verify:** Booking created, payment recorded

### Scenario 2: Free Booking (Near-Peer Mentor)
- **Mentor Type:** Near-peer (is_near_peer = true)
- **Expected:** No payment modal, direct booking
- **Verify:** Booking created with payment_status = 'free'

### Scenario 3: Payment Cancellation
- **Action:** Close Razorpay modal without paying
- **Expected:** Error message, booking not created
- **Verify:** No entries in bookings or payments tables

### Scenario 4: Payment Failure
- **Test Card:** Use Razorpay failure test card
- **Expected:** Payment fails, error message shown
- **Verify:** Booking not created, or status = 'failed'

---

## 🔍 Verification Checklist

### Database Checks (Supabase Dashboard)

#### Bookings Table
```sql
SELECT 
  id,
  student_id,
  mentor_id,
  scheduled_at,
  duration_minutes,
  topic,
  status,
  payment_status,
  payment_id,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Fields:**
- ✅ `student_id` - Current user's ID
- ✅ `mentor_id` - Selected mentor's ID
- ✅ `scheduled_at` - Selected date/time
- ✅ `duration_minutes` - 30, 60, or 90
- ✅ `topic` - User-entered topic
- ✅ `status` - 'confirmed' (after payment)
- ✅ `payment_status` - 'paid' or 'free'
- ✅ `payment_id` - Reference to payments table

#### Payments Table
```sql
SELECT 
  id,
  user_id,
  booking_id,
  amount,
  currency,
  payment_method,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  status,
  created_at
FROM payments
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Fields:**
- ✅ `user_id` - Current user's ID
- ✅ `booking_id` - Reference to booking
- ✅ `amount` - Calculated price (hourly_rate × duration)
- ✅ `currency` - 'INR'
- ✅ `payment_method` - 'razorpay'
- ✅ `razorpay_order_id` - From Razorpay
- ✅ `razorpay_payment_id` - From Razorpay
- ✅ `razorpay_signature` - Verification signature
- ✅ `status` - 'completed'

---

## 🐛 Troubleshooting

### Issue: Razorpay Script Not Loading
**Solution:**
- Check browser console for errors
- Verify internet connection
- Check if Razorpay CDN is accessible

### Issue: Payment Function Not Found
**Solution:**
```bash
# Redeploy the function
supabase functions deploy payments

# Check function logs
supabase functions logs payments
```

### Issue: Payment Verification Failed
**Solution:**
- Check Razorpay keys are correct
- Verify signature calculation in edge function
- Check Supabase secrets are set correctly

### Issue: Database Insert Failed
**Solution:**
- Check RLS policies on `bookings` and `payments` tables
- Verify user is authenticated
- Check foreign key constraints

---

## 📊 Expected Results

### Console Logs (Browser)
```
✅ Razorpay script loaded
✅ Order created: order_xxxxxxxxxxxxx
✅ Payment initiated
✅ Payment successful: pay_xxxxxxxxxxxxx
✅ Payment verified
✅ Booking created: uuid-xxxxx-xxxxx
```

### Network Requests
1. `POST /functions/v1/payments/create-order` - 201 Created
2. Razorpay payment modal interaction
3. `POST /functions/v1/payments/verify` - 200 OK
4. `POST /rest/v1/bookings` - 201 Created

---

## 🎯 Success Criteria

- ✅ Payment modal opens correctly
- ✅ Test card payment succeeds
- ✅ Payment is verified
- ✅ Booking is created in database
- ✅ Payment record is saved
- ✅ User sees success confirmation
- ✅ No console errors
- ✅ Free bookings work (near-peer mentors)

---

## 🚀 Next Steps After Testing

1. **Test on Production:**
   - Switch to live Razorpay keys
   - Test with real payment methods
   - Monitor webhook events

2. **Add Features:**
   - Refund functionality
   - Payment history page
   - Invoice generation
   - Email notifications

3. **Security:**
   - Add rate limiting
   - Implement webhook signature verification
   - Add fraud detection

---

## 📝 Test Card Numbers

### Success Cards
```
4111 1111 1111 1111 - Visa
5555 5555 5555 4444 - Mastercard
```

### Failure Cards
```
4000 0000 0000 0002 - Card declined
4000 0000 0000 0069 - Expired card
```

### 3D Secure Test
```
4000 0027 6000 3184 - Requires 3D Secure
OTP: 1234
```

---

**Testing Status:** ⏳ Ready for Manual Testing  
**Deployment Status:** ⏳ Needs Supabase Function Deployment  
**Integration Status:** ✅ Code Complete

---