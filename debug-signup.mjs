import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Tushar@0099@db.axxkzhcavbqcooevayyn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function debugSignupProcess() {
  try {
    console.log('🔍 DEBUGGING SIGNUP PROCESS...\n');
    await client.connect();

    console.log('1️⃣ CHECKING SUPABASE AUTH.USERS:');
    const authUsers = await client.query(`
      SELECT id, email, created_at, email_confirmed_at,
             raw_user_meta_data->>'role' as role,
             raw_user_meta_data->>'full_name' as full_name
      FROM auth.users
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    console.log(`Found ${authUsers.rows.length} auth users:`);
    authUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role || 'no role'}) - ${user.email_confirmed_at ? 'confirmed' : 'unconfirmed'}`);
    });

    console.log('\n2️⃣ CHECKING USERS TABLE:');
    const users = await client.query(`
      SELECT id, email, full_name, user_type, verified, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    console.log(`Found ${users.rows.length} users in users table:`);
    users.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.user_type || 'no type'}) - ${user.verified ? 'verified' : 'unverified'}`);
    });

    console.log('\n3️⃣ CHECKING RLS POLICIES:');
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies
      WHERE tablename = 'users';
    `);

    console.log(`Found ${policies.rows.length} policies on users table:`);
    policies.rows.forEach((policy, index) => {
      console.log(`   ${index + 1}. ${policy.policyname} (${policy.cmd})`);
    });

    console.log('\n4️⃣ TESTING MANUAL INSERT (to check permissions):');
    try {
      const testInsert = await client.query(`
        INSERT INTO users (id, email, full_name, user_type)
        VALUES ('test-uuid-123', 'test@example.com', 'Test User', 'graduates')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('   ✅ Manual insert succeeded');
    } catch (insertError) {
      console.log(`   ❌ Manual insert failed: ${insertError.message}`);
    }

    await client.end();

    console.log('\n🔧 POSSIBLE ISSUES:');
    console.log('1. RLS policies might be blocking inserts');
    console.log('2. User profile creation trigger might be missing');
    console.log('3. Auth user metadata might not be saving correctly');
    console.log('4. Environment variables might be wrong');

    console.log('\n💡 RECOMMENDED FIXES:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    console.log('3. Ensure RLS policies allow authenticated users to insert');
    console.log('4. Add a database trigger to auto-create user profiles');

  } catch (err) {
    console.error('❌ Debug failed:', err.message);
    process.exit(1);
  }
}

debugSignupProcess();
