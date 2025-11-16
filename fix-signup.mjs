import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Tushar@0099@db.axxkzhcavbqcooevayyn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixSignupIssues() {
  try {
    console.log('🔧 FIXING SIGNUP ISSUES...\n');
    await client.connect();

    console.log('1️⃣ ADDING MISSING RLS POLICY FOR USER INSERTS:');
    const existingPolicies = await client.query(`
      SELECT policyname FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT';
    `);

    if (existingPolicies.rows.length === 0) {
      console.log('   Adding INSERT policy for authenticated users...');
      await client.query(`
        CREATE POLICY "Users can insert their own profile"
          ON public.users FOR INSERT
          WITH CHECK (auth.uid() = id);
      `);
      console.log('   ✅ INSERT policy added');
    } else {
      console.log('   ✅ INSERT policy already exists');
    }

    console.log('\n2️⃣ CHECKING IF TRIGGER EXISTS FOR AUTO-PROFILE CREATION:');
    const triggers = await client.query(`
      SELECT trigger_name FROM information_schema.triggers
      WHERE event_object_table = 'auth.users' AND trigger_name LIKE '%profile%';
    `);

    if (triggers.rows.length === 0) {
      console.log('   Creating function and trigger for auto profile creation...');

      // Create function
      await client.query(`
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.users (id, email, full_name, user_type, verified)
          VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            CASE
              WHEN NEW.raw_user_meta_data->>'role' = 'Student' THEN 'graduates'
              WHEN NEW.raw_user_meta_data->>'role' = 'Mentor' THEN 'mentor'
              ELSE 'graduates'
            END,
            false
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `);

      // Create trigger
      await client.query(`
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `);

      console.log('   ✅ Auto-profile creation trigger added');
    } else {
      console.log('   ✅ Auto-profile creation trigger already exists');
    }

    console.log('\n3️⃣ TESTING THE FIX:');
    console.log('   Now try registering again at http://localhost:5174/register');
    console.log('   The system should automatically create user profiles');

    await client.end();

    console.log('\n✅ SIGNUP FIXES APPLIED!');
    console.log('   - INSERT policy added to users table');
    console.log('   - Auto-profile creation trigger installed');
    console.log('   - Ready for testing');

  } catch (err) {
    console.error('❌ Fix failed:', err.message);
    process.exit(1);
  }
}

fixSignupIssues();
