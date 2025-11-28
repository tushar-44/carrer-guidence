'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ProfilePhotoUpload } from '@/components/profile/ProfilePhotoUpload'
import { EmailVerificationBadge } from '@/components/profile/EmailVerificationBadge'
import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard'
import { supabase } from '@/lib/supabase'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Shield,
  Bell,
  Globe,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const pageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || null
  })

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null
      })
    }
  }, [profile])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login')
    }
  }, [user, authLoading, navigate])

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return

    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.from(pageRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      })

      // Stagger card animations
      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 50,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.2)",
              delay: index * 0.1,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          )
        }
      })
    }, pageRef)

    return () => ctx.revert()
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaveSuccess(false)
  }

  const handlePhotoUpload = async (file: File) => {
    if (!user?.id) return

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }))
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setSaveSuccess(true)
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })

      // Animate success
      gsap.to('.save-button', {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate profile completion
  const profileFields = [
    { key: 'full_name', label: 'Full Name', completed: !!formData.full_name },
    { key: 'email', label: 'Email', completed: !!user?.email },
    { key: 'phone', label: 'Phone', completed: !!formData.phone },
    { key: 'location', label: 'Location', completed: !!formData.location },
    { key: 'bio', label: 'Bio', completed: !!formData.bio },
    { key: 'avatar', label: 'Profile Photo', completed: !!formData.avatar_url }
  ]

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        {/* Profile Completion Card */}
        <div ref={(el) => { cardRefs.current[0] = el }}>
          <ProfileCompletionCard fields={profileFields} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo & Verification */}
          <div className="space-y-6">
            <Card ref={(el) => { cardRefs.current[1] = el }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePhotoUpload
                  currentPhoto={formData.avatar_url}
                  onUpload={handlePhotoUpload}
                  userId={user.id}
                />
              </CardContent>
            </Card>

            <Card ref={(el) => { cardRefs.current[2] = el }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EmailVerificationBadge />
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Account Created</span>
                    <span className="text-sm font-medium">
                      {profile?.created_at 
                        ? new Date(profile.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  {user.last_sign_in_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Login</span>
                      <span className="text-sm font-medium">
                        {new Date(user.last_sign_in_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <Card ref={(el) => { cardRefs.current[3] = el }}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        maxLength={500}
                        className="transition-all focus:scale-[1.01]"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about your account
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Public Profile</p>
                            <p className="text-sm text-muted-foreground">
                              Make your profile visible to others
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="save-button gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
