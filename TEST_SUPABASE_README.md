# 🧪 Supabase Connection Test Script

## Quick Start

Run the test script to verify your Supabase backend connection:

```bash
node test-supabase-connection.mjs
```

---

## What It Tests

### ✅ Test 1: Environment Variables
- Checks if `.env.local` file exists
- Verifies `VITE_SUPABASE_URL` is set
- Verifies `VITE_SUPABASE_ANON_KEY` is set
- Checks for placeholder values

### ✅ Test 2: Supabase Client
- Initializes Supabase client
- Verifies client creation

### ✅ Test 3: Connection
- Tests connection to Supabase
- Verifies network connectivity
- Checks if database is accessible

### ✅ Test 4: Authentication
- Tests auth configuration
- Verifies auth endpoints are working

### ✅ Test 5: Database Tables
- Checks if all core tables exist:
  - `users`
  - `mentors`
  - `jobs`
  - `assessments`
  - `bookings`
  - `payments`

---

## Expected Output

### ✅ Success
```
✅ All tests passed! Your Supabase backend is ready!
```

### ⚠️ Warnings
- Missing tables → Run SQL schema
- Placeholder values → Update .env.local
- Connection issues → Check credentials

---

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install @supabase/supabase-js
```

### Error: "Environment variables not found"
**Solution:**
- Make sure `.env.local` exists in project root
- Check file has correct variable names
- Restart terminal after creating file

### Error: "Database tables not found"
**Solution:**
- Run `supabase/complete_database_schema.sql` in Supabase SQL Editor
- Verify tables were created in Supabase Dashboard

### Error: "Connection failed"
**Solution:**
- Check your internet connection
- Verify Supabase URL is correct
- Verify anon key is correct
- Check Supabase project is active

---

## After Running Tests

If all tests pass:
1. ✅ Start dev server: `npm run dev`
2. ✅ Test authentication in browser
3. ✅ Check browser console for errors

If tests fail:
1. ⚠️ Fix issues shown in test output
2. ⚠️ Re-run the test script
3. ⚠️ Check `BACKEND_IMPLEMENTATION_GUIDE.md` for help

---

## Files

- `test-supabase-connection.mjs` - Main test script (use this)
- `test-supabase-connection.js` - Alternative version
- `TEST_SUPABASE_README.md` - This file

---

**Run the test now:**
```bash
node test-supabase-connection.mjs
```

