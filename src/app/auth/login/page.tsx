import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Github, Linkedin, Sparkles, Shield, Zap, Chrome, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const { error } = await signIn({ email: formData.email, password: formData.password });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('Login successful, navigating to dashboard...');
      toast.success('Welcome back! Redirecting to your dashboard...');
      
      // Navigate immediately - the auth state will trigger re-render
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      toast.error(err?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      if (provider === 'Google') {
        await signInWithGoogle();
      } else {
        toast.success(`Connecting with ${provider}...`);
        // Simulate other social logins
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
      {/* Home Button */}
      <Link to="/" className="fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      </Link>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mr-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareerPath
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome Back to Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Career Journey
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Continue discovering your perfect career path with AI-powered insights,
              expert mentorship, and real-time market data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-8 w-8 text-blue-600 mb-2 mx-auto lg:mx-0" />
                  <h3 className="font-semibold mb-1">AI-Powered</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Smart career matching</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20">
                  <Shield className="h-8 w-8 text-green-600 mb-2 mx-auto lg:mx-0" />
                  <h3 className="font-semibold mb-1">Secure</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20">
                  <Zap className="h-8 w-8 text-purple-600 mb-2 mx-auto lg:mx-0" />
                  <h3 className="font-semibold mb-1">Instant</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time insights</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>150K+ Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>2.5K+ Mentors</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>98% Success Rate</span>
              </div>
            </div>
          </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-2 border-blue-500/20 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold mb-2">Sign In</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your personalized career dashboard
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Login Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('Google')}
                    className="p-3 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20"
                  >
                    <Chrome className="h-5 w-5 text-red-600" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('GitHub')}
                    className="p-3 hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-800"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('LinkedIn')}
                    className="p-3 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData({...formData, rememberMe: !!checked})}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/auth/register" className="text-blue-600 hover:underline font-medium">
                      Sign up for free
                    </Link>
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-4 border-t">
                  <Shield className="h-3 w-3" />
                  <span>Protected by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
