/**
 * Supabase Connection Test Script (ESM Version)
 * 
 * This script tests your Supabase backend connection
 * Run with: node test-supabase-connection.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      line = line.trim()
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').trim()
        if (key && value) {
          envVars[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
      }
    })
    
    Object.assign(process.env, envVars)
  } catch (error) {
    console.log('⚠️  Could not load .env.local file')
    console.log('   Make sure the file exists in the project root\n')
  }
}

loadEnv()

console.log('🔍 Testing Supabase Connection...\n')
console.log('='.repeat(50))

// Test 1: Check Environment Variables
console.log('\n📋 Test 1: Checking Environment Variables')
console.log('-'.repeat(50))

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let envCheck = true

if (!supabaseUrl) {
  console.log('❌ VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is missing')
  envCheck = false
} else {
  console.log(`✅ Supabase URL found: ${supabaseUrl}`)
  if (supabaseUrl.includes('YOUR-PROJECT-ID') || supabaseUrl.includes('placeholder')) {
    console.log('⚠️  Warning: URL contains placeholder. Update with your actual project ID.')
    envCheck = false
  }
}

if (!supabaseAnonKey) {
  console.log('❌ VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
  envCheck = false
} else {
  if (supabaseAnonKey.includes('your-') || supabaseAnonKey.includes('placeholder') || supabaseAnonKey.length < 50) {
    console.log('⚠️  Warning: Anon key appears to be a placeholder. Update with your actual key.')
    envCheck = false
  } else {
    console.log(`✅ Supabase Anon Key found: ${supabaseAnonKey.substring(0, 20)}...`)
  }
}

if (!serviceRoleKey) {
  console.log('⚠️  Service Role Key not found (optional for basic tests)')
} else {
  if (serviceRoleKey.includes('your-') || serviceRoleKey.includes('placeholder') || serviceRoleKey.length < 50) {
    console.log('⚠️  Warning: Service role key appears to be a placeholder.')
  } else {
    console.log(`✅ Service Role Key found: ${serviceRoleKey.substring(0, 20)}...`)
  }
}

if (!envCheck) {
  console.log('\n❌ Environment variables not properly configured!')
  console.log('Please update your .env.local file with actual Supabase credentials.')
  process.exit(1)
}

// Test 2: Initialize Supabase Client
console.log('\n🔌 Test 2: Initializing Supabase Client')
console.log('-'.repeat(50))

let supabase
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  })
  console.log('✅ Supabase client created successfully')
} catch (error) {
  console.log('❌ Failed to create Supabase client:', error.message)
  process.exit(1)
}

// Test 3: Test Connection (Health Check)
console.log('\n🌐 Test 3: Testing Connection to Supabase')
console.log('-'.repeat(50))

async function testConnection() {
  try {
    // Try to fetch from a public table (jobs table should be accessible)
    const { data, error } = await supabase
      .from('jobs')
      .select('id')
      .limit(1)

    if (error) {
      // Check if it's a table not found error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('❌ Database tables not found!')
        console.log('   → Run the SQL from: supabase/complete_database_schema.sql')
        console.log('   → In Supabase Dashboard → SQL Editor')
        return false
      }
      // Check if it's a permission error
      if (error.message.includes('permission') || error.message.includes('RLS')) {
        console.log('⚠️  Connection works but RLS policies might need adjustment')
        console.log('   → This is OK - tables exist and connection is working')
        return true
      }
      console.log('❌ Connection error:', error.message)
      return false
    }

    console.log('✅ Successfully connected to Supabase!')
    console.log(`   → Can query database tables`)
    return true
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    return false
  }
}

// Test 4: Test Authentication
console.log('\n🔐 Test 4: Testing Authentication Setup')
console.log('-'.repeat(50))

async function testAuth() {
  try {
    // Test if auth is configured
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('⚠️  Auth check:', error.message)
      console.log('   → This is normal if you\'re not logged in')
    } else {
      if (session) {
        console.log('✅ User session found (you are logged in)')
      } else {
        console.log('✅ Auth is configured correctly (no active session)')
      }
    }
    return true
  } catch (error) {
    console.log('❌ Auth test failed:', error.message)
    return false
  }
}

// Test 5: Check Database Tables
console.log('\n📊 Test 5: Checking Database Tables')
console.log('-'.repeat(50))

async function checkTables() {
  const tables = [
    'users',
    'mentors',
    'jobs',
    'assessments',
    'bookings',
    'payments'
  ]

  let tablesFound = 0
  let tablesMissing = []

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(0)

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          tablesMissing.push(table)
        } else {
          // Other errors (like RLS) mean table exists
          tablesFound++
        }
      } else {
        tablesFound++
      }
    } catch (error) {
      tablesMissing.push(table)
    }
  }

  console.log(`✅ Found ${tablesFound}/${tables.length} tables`)
  if (tablesMissing.length > 0) {
    console.log(`⚠️  Missing tables: ${tablesMissing.join(', ')}`)
    console.log('   → Run: supabase/complete_database_schema.sql in Supabase SQL Editor')
  } else {
    console.log('✅ All core tables exist!')
  }

  return tablesMissing.length === 0
}

// Run all tests
async function runAllTests() {
  const connectionTest = await testConnection()
  await testAuth()
  const tablesTest = await checkTables()

  // Final Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))

  if (connectionTest && tablesTest) {
    console.log('\n✅ All tests passed! Your Supabase backend is ready!')
    console.log('\n🎉 Next steps:')
    console.log('   1. Start your dev server: npm run dev')
    console.log('   2. Test authentication (signup/login)')
    console.log('   3. Check browser console for any errors')
    console.log('\n✨ Your backend is fully configured!')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.')
    if (!connectionTest) {
      console.log('\n💡 Fix connection issues:')
      console.log('   → Verify your Supabase URL and keys in .env.local')
      console.log('   → Check your internet connection')
    }
    if (!tablesTest) {
      console.log('\n💡 Fix database issues:')
      console.log('   → Run: supabase/complete_database_schema.sql')
      console.log('   → In Supabase Dashboard → SQL Editor')
    }
  }
  console.log('\n')
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test script error:', error)
  process.exit(1)
})

