import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './AuthProvider'
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'


export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithGoogle, signIn } = useAuth()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        console.error('Error signing in:', error)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await signIn({
        email,
        password,
      })
      if (error) {
        console.error('Error signing in:', error)
        // You might want to show an error message to the user here
      } else {
        // Redirect or handle successful login
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-purple/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent-cyan/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-accent-pink/25 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent-purple/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                  <span className="text-sm font-medium text-accent-purple">CareerPath Platform</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-pink bg-clip-text text-transparent">
                    Shape Your
                  </span>
                  <br />
                  <span className="text-foreground">Future Career</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-md">
                  Join thousands of professionals discovering their perfect career path with AI-powered guidance and personalized mentorship.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: '🎯', title: 'Personalized Roadmaps', desc: 'AI-driven career paths tailored to your goals' },
                  { icon: '👥', title: 'Expert Mentorship', desc: 'Connect with industry professionals' },
                  { icon: '📊', title: 'Skill Assessment', desc: 'Track your progress and growth' }
                ].map((feature, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-accent-purple/30 transition-all duration-300"
                  >
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="relative">
              <Card className="w-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl">
                  <CardHeader className="text-center space-y-2 pb-6">
                    <div className="lg:hidden mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
                        <Sparkles className="w-4 h-4 text-accent-purple" />
                        <span className="text-xs font-medium text-accent-purple">CareerPath</span>
                      </div>
                    </div>

                    <CardTitle className="text-3xl font-bold">
                      <AnimatedShinyText shimmerWidth={200}>
                        Welcome Back
                      </AnimatedShinyText>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Sign in to continue your journey
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 bg-background/50 border-border/50 focus:border-accent-purple/50 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <button
                            type="button"
                            className="text-xs text-accent-purple hover:text-accent-cyan transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-accent-purple/50 transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Remember me for 30 days
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-accent-purple to-accent-cyan hover:from-accent-purple/90 hover:to-accent-cyan/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      variant="outline"
                      className="w-full h-12 border-border/50 hover:border-accent-purple/50 hover:bg-accent-purple/5 transition-all duration-300"
                      size="lg"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Don't have an account? </span>
                      <button
                        type="button"
                        className="text-accent-purple hover:text-accent-cyan font-medium transition-colors"
                        onClick={() => window.location.href = '/auth/signup'}
                      >
                        Sign up
                      </button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                      By signing in, you agree to our{' '}
                      <button type="button" className="text-accent-purple hover:underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-accent-purple hover:underline">
                        Privacy Policy
                      </button>
                    </p>
                  </CardContent>
                </Card>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-purple/20 rounded-full blur-2xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-cyan/20 rounded-full blur-2xl -z-10" />
              </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 CareerPath. All rights reserved.
        </p>
      </div>
    </div>
  )
}
