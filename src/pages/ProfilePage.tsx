import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/navigation/nav-bar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/sections/footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
    }
  }, [user, profile, authLoading, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <SEO
        title="My CareerPath Profile"
        description="Manage your CareerPath profile, update your preferences, and track your career development journey."
        url="https://www.careerpath.dev/profile"
      />
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="w-full max-w-4xl mx-auto flex-1 pt-20 px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl text-foreground mb-4">
                My CareerPath Profile
              </h1>
              <p className="font-body text-lg text-muted-foreground">
                Manage your profile, update your preferences, and track your career development journey.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {profile && (
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Input
                      value={profile.user_type}
                      disabled
                      className="bg-muted capitalize"
                    />
                  </div>
                )}

                <Button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
