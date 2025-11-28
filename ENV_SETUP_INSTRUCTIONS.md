# 🔐 Environment Variables Setup Guide

## ✅ Step 1: Create .env.local File

Since `.env.local` is in `.gitignore` (for security), you need to create it manually:

### Option A: Copy the Template
```bash
# Copy the example file
cp .env.local.example .env.local
```

### Option B: Create Manually
1. Create a new file named `.env.local` in your project root
2. Copy the contents from `.env.local.example`
3. Save the file

---

## ✅ Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this
   - **service_role** key - Copy this (keep secret!)

---

## ✅ Step 3: Update .env.local File

Open `.env.local` and replace these values:

### Required Variables (Must Fill):

```env
# Replace YOUR-PROJECT-ID with your actual project ID
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co

# Replace with your anon public key
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Replace with your service role key (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Same values for Next.js (if using)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Example (What it should look like):

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## ✅ Step 4: Optional Variables (Fill if Needed)

### Razorpay (For Payments)
Only fill if you're using payment features:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your-razorpay-secret-here
```

### Web3Forms (For Contact Form)
Only fill if you're using the contact form:
```env
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-key-here
```

### Cloudinary (For Media)
Only fill if you're using Cloudinary:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## ✅ Step 5: Restart Dev Server

After updating `.env.local`:

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

## ✅ Step 6: Verify It's Working

1. Open your app: `http://localhost:5173`
2. Open browser console (F12)
3. Try to sign up/login
4. Check for errors:
   - ✅ No errors = Working!
   - ❌ "Invalid API key" = Check your keys
   - ❌ "Missing Supabase URL" = Check variable names

---

## 🔍 Quick Checklist

- [ ] Created `.env.local` file
- [ ] Got Supabase credentials from dashboard
- [ ] Replaced `VITE_SUPABASE_URL` with your project URL
- [ ] Replaced `VITE_SUPABASE_ANON_KEY` with your anon key
- [ ] Replaced `SUPABASE_SERVICE_ROLE_KEY` with service role key
- [ ] Updated Next.js variables (if using Next.js)
- [ ] Restarted dev server
- [ ] Tested authentication (signup/login)
- [ ] No console errors

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
**Solution:** 
- Check `.env.local` exists in project root
- Check variable names match exactly (case-sensitive)
- Restart dev server

### Error: "Invalid API key"
**Solution:**
- Verify you copied the entire key (no spaces)
- Check you're using the correct key (anon vs service_role)
- Make sure no extra quotes around the value

### Error: "CORS error"
**Solution:**
- Go to Supabase Dashboard → Settings → API
- Add your domain to CORS settings:
  - `http://localhost:5173`
  - `http://localhost:3000`

### Variables not loading
**Solution:**
- Make sure file is named exactly `.env.local` (not `.env.local.txt`)
- Restart dev server after changes
- Check file is in project root (same level as `package.json`)

---

## 🔒 Security Notes

1. ✅ `.env.local` is already in `.gitignore` - don't commit it!
2. ✅ Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
3. ✅ The `anon` key is safe to use in frontend code
4. ✅ Service role key should only be used server-side

---

## 📝 File Structure

```
your-project/
├── .env.local              ← Create this file (not in Git)
├── .env.local.example      ← Template (safe to commit)
├── package.json
└── ...
```

---

## ✅ You're Done!

Once you've:
1. Created `.env.local`
2. Added your Supabase keys
3. Restarted the server
4. Tested authentication

**Your backend connection is complete!** 🎉

---

**Next Steps:**
- Test authentication (signup/login)
- Try fetching data from database
- Check browser console for any errors

**Need Help?** Check `BACKEND_IMPLEMENTATION_GUIDE.md` → Phase 3

