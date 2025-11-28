import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Required variables:');
  console.log('  - VITE_SUPABASE_URL');
  console.log('  - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Testing Authentication Flow\n');
console.log('Supabase URL:', supabaseUrl);
console.log('---\n');

// Test credentials
const testUser = {
  email: 'testuser@careerpath.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  userType: 'graduates'
};

async function testSignup() {
  console.log('1️⃣ Testing Signup...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: `${testUser.firstName} ${testUser.lastName}`,
          user_type: testUser.userType,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('   ℹ️  User already exists, skipping signup');
        return { success: true, alreadyExists: true };
      }
      console.error('   ❌ Signup error:', error.message);
      return { success: false, error };
    }

    console.log('   ✅ Signup successful!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    
    // Wait a bit for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, user: data.user };
  } catch (err) {
    console.error('   ❌ Unexpected error:', err.message);
    return { success: false, error: err };
  }
}

async function checkProfile(userId) {
  console.log('\n2️⃣ Checking Profile Creation...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('   ❌ Profile not found:', error.message);
      return { success: false, error };
    }

    console.log('   ✅ Profile found!');
    console.log('   Email:', data.email);
    console.log('   Name:', data.full_name);
    console.log('   Type:', data.user_type);
    console.log('   Verified:', data.verified);
    
    return { success: true, profile: data };
  } catch (err) {
    console.error('   ❌ Unexpected error:', err.message);
    return { success: false, error: err };
  }
}

async function testLogin() {
  console.log('\n3️⃣ Testing Login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    });

    if (error) {
      console.error('   ❌ Login error:', error.message);
      return { success: false, error };
    }

    console.log('   ✅ Login successful!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    console.log('   Session:', data.session ? 'Active' : 'None');
    
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    console.error('   ❌ Unexpected error:', err.message);
    return { success: false, error: err };
  }
}

async function testProfileFetch(userId) {
  console.log('\n4️⃣ Testing Profile Fetch After Login...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('   ❌ Profile fetch error:', error.message);
      return { success: false, error };
    }

    console.log('   ✅ Profile fetched successfully!');
    console.log('   All user data:', JSON.stringify(data, null, 2));
    
    return { success: true, profile: data };
  } catch (err) {
    console.error('   ❌ Unexpected error:', err.message);
    return { success: false, error: err };
  }
}

async function checkRLSPolicies() {
  console.log('\n5️⃣ Checking RLS Policies...');
  
  try {
    // Try to read from users table
    const { data, error } = await supabase
      .from('users')
      .select('count');

    if (error) {
      console.error('   ❌ RLS Policy error:', error.message);
      console.log('   💡 This might indicate RLS policies are blocking access');
      return { success: false, error };
    }

    console.log('   ✅ RLS policies allow read access');
    
    return { success: true };
  } catch (err) {
    console.error('   ❌ Unexpected error:', err.message);
    return { success: false, error: err };
  }
}

// Run all tests
async function runTests() {
  try {
    // Check RLS first
    await checkRLSPolicies();
    
    // Test signup
    const signupResult = await testSignup();
    
    if (!signupResult.success && !signupResult.alreadyExists) {
      console.log('\n❌ Signup failed, stopping tests');
      return;
    }
    
    // Test login
    const loginResult = await testLogin();
    
    if (!loginResult.success) {
      console.log('\n❌ Login failed, stopping tests');
      return;
    }
    
    // Check profile after signup
    if (loginResult.user) {
      await checkProfile(loginResult.user.id);
      await testProfileFetch(loginResult.user.id);
    }
    
    console.log('\n✅ All tests completed!');
    console.log('\n📝 Test User Credentials:');
    console.log('   Email:', testUser.email);
    console.log('   Password:', testUser.password);
    console.log('\n💡 You can now use these credentials to login at:');
    console.log('   http://localhost:5174/auth/login');
    
  } catch (err) {
    console.error('\n❌ Test suite error:', err);
  } finally {
    // Sign out
    await supabase.auth.signOut();
  }
}

runTests();