# 🚀 Quick Setup: Create .env.local File

## ✅ Method 1: Manual Creation (Recommended)

### Step 1: Create the File
1. In your project root, create a new file named: `.env.local`
2. Make sure it's exactly `.env.local` (not `.env.local.txt`)

### Step 2: Copy This Content

Open `.env.local` and paste this:

```env
# ============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================
# Get these from: Supabase Dashboard → Settings → API

# Vite/React Frontend Variables
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Next.js Server-Side Variables
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here

# Service Role Key (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# OPTIONAL VARIABLES (Fill if needed)
# ============================================

# Razorpay (for payments)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id-here
VITE_RAZORPAY_KEY_SECRET=your-razorpay-key-secret-here

# Web3Forms (for contact form)
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here

# Cloudinary (for media)
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name-here
```

### Step 3: Replace Placeholders

Replace:
- `YOUR-PROJECT-ID` → Your actual Supabase project ID
- `your-anon-public-key-here` → Your anon public key
- `your-service-role-key-here` → Your service role key

---

## ✅ Method 2: Copy from Template

1. Open `env-template.txt` in your project
2. Copy all contents
3. Create new file `.env.local`
4. Paste and replace placeholders

---

## 📍 Where to Get Supabase Keys

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ After Creating .env.local

1. **Save the file**
2. **Restart dev server:**
   ```bash
   npm run dev
   ```
3. **Test it:**
   - Open app: http://localhost:5173
   - Try signup/login
   - Check browser console (F12) for errors

---

## 🎯 Quick Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added Supabase URL (with your project ID)
- [ ] Added Supabase anon key
- [ ] Added Supabase service role key
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested authentication

---

## ✅ Done!

Your `.env.local` file is ready! Just replace the placeholder values with your actual Supabase keys.

**See `ENV_SETUP_INSTRUCTIONS.md` for detailed instructions.**

