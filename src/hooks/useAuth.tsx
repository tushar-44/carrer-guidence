import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: 'graduates' | 'mentor' | 'company'
  bio: string | null
  phone: string | null
  location: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signIn: (data: { email: string; password: string }) => Promise<{ error: any }>
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116' || error.message.includes('No rows')) {
          console.log('Profile not found, creating new profile...')
          return await createUserProfile(userId)
        }
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      // Get user from auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error('Error getting auth user:', authError)
        return null
      }

      // Create profile in users table
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          user_type: authUser.user_metadata?.user_type || 'graduates',
          verified: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return null
      }

      console.log('✅ User profile created successfully')
      return data as UserProfile
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)

          // Fetch user profile if session exists
          if (session?.user?.id) {
            const userProfile = await fetchUserProfile(session.user.id)
            setProfile(userProfile)
            
            // Sync with userStore
            if (userProfile) {
              try {
                const { useUserStore } = await import('@/stores/userStore')
                useUserStore.getState().setUser({
                  id: userProfile.id,
                  name: userProfile.full_name || userProfile.email.split('@')[0],
                  email: userProfile.email,
                  type: userProfile.user_type,
                  avatar: userProfile.avatar_url || undefined,
                  createdAt: new Date(userProfile.created_at),
                  preferences: {
                    theme: 'dark',
                    notifications: true,
                    language: 'en'
                  }
                })
              } catch (err) {
                console.error('Error syncing with userStore:', err)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          try {
            console.log('Auth state changed:', event, session)
            setSession(session)
            setUser(session?.user ?? null)

            // Fetch or clear user profile based on session
            if (session?.user?.id) {
              const userProfile = await fetchUserProfile(session.user.id)
              setProfile(userProfile)
              
              // Sync with userStore
              if (userProfile) {
                try {
                  const { useUserStore } = await import('@/stores/userStore')
                  useUserStore.getState().setUser({
                    id: userProfile.id,
                    name: userProfile.full_name || userProfile.email.split('@')[0],
                    email: userProfile.email,
                    type: userProfile.user_type,
                    avatar: userProfile.avatar_url || undefined,
                    createdAt: new Date(userProfile.created_at),
                    preferences: {
                      theme: 'dark',
                      notifications: true,
                      language: 'en'
                    }
                  })
                } catch (err) {
                  console.error('Error syncing with userStore:', err)
                }
              }
            } else {
              setProfile(null)
              // Clear userStore on logout
              try {
                const { useUserStore } = await import('@/stores/userStore')
                useUserStore.getState().logout()
              } catch (err) {
                console.error('Error clearing userStore:', err)
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error)
          } finally {
            setLoading(false)
          }
        }
      )

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signIn = async (data: { email: string; password: string }) => {
    try {
      console.log('🔐 Signing in user:', data.email);
      const { data: signInData, error } = await supabase.auth.signInWithPassword(data)
      
      if (error) {
        console.error('❌ Sign in error:', error)
        return { error }
      }

      if (signInData.user) {
        console.log('✅ Auth successful, fetching profile...');
        // Fetch and sync profile immediately after login
        const userProfile = await fetchUserProfile(signInData.user.id)
        
        if (userProfile) {
          console.log('✅ Profile fetched:', userProfile.email, userProfile.user_type);
          setProfile(userProfile)
          
          // Sync with userStore
          const { useUserStore } = await import('@/stores/userStore')
          useUserStore.getState().setUser({
            id: userProfile.id,
            name: userProfile.full_name || userProfile.email.split('@')[0],
            email: userProfile.email,
            type: userProfile.user_type,
            avatar: userProfile.avatar_url || undefined,
            createdAt: new Date(userProfile.created_at),
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            }
          })
          console.log('✅ User logged in and profile synced to store')
        } else {
          console.error('❌ Failed to fetch user profile');
          return { error: { message: 'Failed to load user profile' } }
        }
      }
      
      return { error: null }
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err)
      return { error: err }
    }
  }

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string; userType?: string }) => {
    try {
      const { error, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            user_type: data.userType || 'graduates',
          },
        },
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      if (signUpData.user) {
        // Create profile immediately after signup
        console.log('Creating user profile...')
        const profile = await createUserProfile(signUpData.user.id)
        
        if (profile) {
          setProfile(profile)
          
          // Sync with userStore
          const { useUserStore } = await import('@/stores/userStore')
          useUserStore.getState().setUser({
            id: profile.id,
            name: profile.full_name || profile.email.split('@')[0],
            email: profile.email,
            type: profile.user_type,
            avatar: profile.avatar_url || undefined,
            createdAt: new Date(profile.created_at),
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            }
          })
          console.log('✅ User registered and profile created')
        }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected sign up error:', err)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }
      return { error: null }
    } catch (err) {
      console.error('Unexpected sign out error:', err)
      return { error: err }
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
