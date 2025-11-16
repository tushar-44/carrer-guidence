import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Tushar@0099@db.axxkzhcavbqcooevayyn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function testSignupProcess() {
  try {
    console.log('🧪 TESTING SIGNUP PROCESS...\n');
    await client.connect();

    console.log('1️⃣ CHECKING TRIGGER FUNCTION:');
    const functions = await client.query(`
      SELECT routine_name FROM information_schema.routines
      WHERE routine_name = 'handle_new_user';
    `);

    if (functions.rows.length > 0) {
      console.log('   ✅ handle_new_user function exists');
    } else {
      console.log('   ❌ handle_new_user function missing');
    }

    console.log('\n2️⃣ CHECKING TRIGGER:');
    const triggers = await client.query(`
      SELECT trigger_name FROM information_schema.triggers
      WHERE trigger_name = 'on_auth_user_created';
    `);

    if (triggers.rows.length > 0) {
      console.log('   ✅ on_auth_user_created trigger exists');
    } else {
      console.log('   ❌ on_auth_user_created trigger missing');
    }

    console.log('\n3️⃣ TESTING TRIGGER WITH MANUAL INSERT:');
    // Get the most recent auth user
    const recentUser = await client.query(`
      SELECT id, email, raw_user_meta_data
      FROM auth.users
      ORDER BY created_at DESC
      LIMIT 1;
    `);

    if (recentUser.rows.length > 0) {
      const user = recentUser.rows[0];
      console.log(`   Testing with user: ${user.email}`);

      // Check if profile already exists
      const existingProfile = await client.query(`
        SELECT id FROM users WHERE id = $1;
      `, [user.id]);

      if (existingProfile.rows.length === 0) {
        console.log('   No profile exists, testing trigger...');

        // Manually call the trigger function to test it
        const testTrigger = await client.query(`
          SELECT public.handle_new_user() AS result;
        `);

        console.log('   Trigger function called');
      } else {
        console.log('   Profile already exists');
      }
    }

    console.log('\n4️⃣ FINAL USERS TABLE CHECK:');
    const finalUsers = await client.query(`
      SELECT id, email, full_name, user_type, verified, created_at
      FROM users
      ORDER BY created_at DESC;
    `);

    console.log(`Found ${finalUsers.rows.length} users in users table:`);
    finalUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.user_type}) - ${user.verified ? 'verified' : 'unverified'}`);
    });

    await client.end();

    console.log('\n✅ TESTING COMPLETE!');
    console.log('   If you see users in the table, the trigger is working.');
    console.log('   If not, there might be an issue with the trigger function.');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testSignupProcess();
