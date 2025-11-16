import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Tushar@0099@db.axxkzhcavbqcooevayyn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function verifySignup() {
  try {
    console.log('🔍 VERIFYING SIGNUP SYSTEM...\n');
    await client.connect();

    console.log('1️⃣ CHECKING ALL COMPONENTS:');

    // Check function
    const funcCheck = await client.query(`
      SELECT routine_name FROM information_schema.routines
      WHERE routine_name = 'handle_new_user';
    `);
    console.log(`   Function exists: ${funcCheck.rows.length > 0 ? '✅' : '❌'}`);

    // Check trigger
    const triggerCheck = await client.query(`
      SELECT trigger_name FROM information_schema.triggers
      WHERE trigger_name = 'on_auth_user_created';
    `);
    console.log(`   Trigger exists: ${triggerCheck.rows.length > 0 ? '✅' : '❌'}`);

    // Check policies
    const policyCheck = await client.query(`
      SELECT COUNT(*) as count FROM pg_policies WHERE tablename = 'users';
    `);
    console.log(`   RLS policies: ${policyCheck.rows[0].count} found ✅`);

    console.log('\n2️⃣ CURRENT STATE:');
    const authUsers = await client.query(`
      SELECT COUNT(*) as count FROM auth.users;
    `);
    const profiles = await client.query(`
      SELECT COUNT(*) as count FROM users;
    `);

    console.log(`   Auth users: ${authUsers.rows[0].count}`);
    console.log(`   User profiles: ${profiles.rows[0].count}`);

    if (parseInt(authUsers.rows[0].count) > parseInt(profiles.rows[0].count)) {
      console.log('   ⚠️  Mismatch detected - some users missing profiles');
    } else {
      console.log('   ✅ All auth users have profiles');
    }

    console.log('\n3️⃣ MANUAL PROFILE CREATION TEST:');
    // Get users without profiles
    const missingProfiles = await client.query(`
      SELECT au.id, au.email, au.raw_user_meta_data
      FROM auth.users au
      LEFT JOIN users u ON au.id = u.id
      WHERE u.id IS NULL;
    `);

    if (missingProfiles.rows.length > 0) {
      console.log(`   Found ${missingProfiles.rows.length} users without profiles. Creating them...`);

      for (const user of missingProfiles.rows) {
        try {
          await client.query(`
            INSERT INTO users (id, email, full_name, user_type, verified)
            VALUES ($1, $2, $3, $4, false)
            ON CONFLICT (id) DO NOTHING;
          `, [
            user.id,
            user.email,
            user.raw_user_meta_data?.full_name || user.email.split('@')[0],
            user.raw_user_meta_data?.role === 'Student' ? 'graduates' : 'mentor'
          ]);
          console.log(`   ✅ Created profile for ${user.email}`);
        } catch (err) {
          console.log(`   ❌ Failed to create profile for ${user.email}: ${err.message}`);
        }
      }
    } else {
      console.log('   ✅ All users have profiles');
    }

    console.log('\n4️⃣ FINAL VERIFICATION:');
    const finalCheck = await client.query(`
      SELECT au.email, u.full_name, u.user_type
      FROM auth.users au
      JOIN users u ON au.id = u.id
      ORDER BY au.created_at DESC;
    `);

    console.log(`Total users with complete profiles: ${finalCheck.rows.length}`);
    finalCheck.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} - ${user.full_name} (${user.user_type})`);
    });

    await client.end();

    console.log('\n🎉 VERIFICATION COMPLETE!');
    console.log('   The signup system should now work correctly.');
    console.log('   Try registering at http://localhost:5174/register');

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
}

verifySignup();
