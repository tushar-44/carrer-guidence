import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { auth } from '@/lib/supabase'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/stores/userStore'
import type { UserType } from '@/constants/index'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ data: unknown; error: unknown }>
  signIn: (data: { email: string; password: string }) => Promise<{ error: unknown }>
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ error: unknown }>
  signOut: () => Promise<{ error: unknown }>
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
  const [loading, setLoading] = useState(true)
  const { setUser: setUserStore, logout: logoutStore } = useUserStore()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session: initialSession } = await auth.getSession()
      setSession(initialSession)
      setUser(initialSession?.user ?? null)

        // Sync with user store
      if (initialSession?.user) {
        // Fetch user profile from database
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', initialSession.user.id)
          .single()

        if (profile && !error) {
          setUserStore({
            id: profile.id,
            name: profile.full_name || initialSession.user.email?.split('@')[0] || 'User',
            email: profile.email,
            type: profile.user_type as UserType,
            avatar: profile.avatar_url,
            createdAt: new Date(profile.created_at),
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            }
          })
        } else {
          // Fallback to auth metadata if profile not found
          const userType = initialSession.user.user_metadata?.user_type as UserType || null;
          setUserStore({
            id: initialSession.user.id,
            name: initialSession.user.user_metadata?.full_name || initialSession.user.email?.split('@')[0] || 'User',
            email: initialSession.user.email || '',
            type: userType || 'graduates' as UserType,
            avatar: initialSession.user.user_metadata?.avatar_url,
            createdAt: new Date(),
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            }
          })
        }
      } else {
        logoutStore()
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile from database
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile && !error) {
            setUserStore({
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              type: profile.user_type as UserType,
              avatar: profile.avatar_url,
              createdAt: new Date(profile.created_at),
              preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en'
              }
            })
          } else {
            // Fallback to auth metadata
            const userType = session.user.user_metadata?.user_type as UserType || null;
            setUserStore({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              type: userType || 'graduates' as UserType,
              avatar: session.user.user_metadata?.avatar_url,
              createdAt: new Date(),
              preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en'
              }
            })
          }
        } else {
          logoutStore()
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUserStore, logoutStore])

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const { error } = await auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: `${data.firstName} ${data.lastName}`,
        },
      },
    });
    return { error };
  };

  const signIn = async (data: { email: string; password: string }) => {
    const { error } = await auth.signInWithPassword(data);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle: auth.signInWithGoogle,
    signIn,
    signUp,
    signOut: auth.signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
