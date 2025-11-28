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
import { Badge } from '@/components/ui/badge'
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
  Briefcase,
  Award,
  DollarSign,
  Clock,
  Loader2,
  Save,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface MentorData {
  title: string
  expertise: string[]
  experience_years: number
  hourly_rate: number
  bio: string
  languages: string[]
  education: string
  company: string
  response_time: string
  specializations: string[]
  achievements: string[]
}

export default function MentorProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [mentorData, setMentorData] = useState<MentorData | null>(null)
  
  const pageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || null,
    // Mentor-specific fields
    title: '',
    expertise: [] as string[],
    experience_years: 0,
    hourly_rate: 0,
    languages: [] as string[],
    education: '',
    company: '',
    response_time: '',
    specializations: [] as string[],
    achievements: [] as string[]
  })

  const [newExpertise, setNewExpertise] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newAchievement, setNewAchievement] = useState('')

  // Fetch mentor data
  useEffect(() => {
    const fetchMentorData = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching mentor data:', error)
        }

        if (data) {
          setMentorData(data)
          setFormData(prev => ({
            ...prev,
            title: data.title || '',
            expertise: data.expertise || [],
            experience_years: data.experience_years || 0,
            hourly_rate: data.hourly_rate || 0,
            languages: data.languages || [],
            education: data.education || '',
            company: data.company || '',
            response_time: data.response_time || '',
            specializations: data.specializations || [],
            achievements: data.achievements || []
          }))
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchMentorData()
    }
  }, [user])

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null
      }))
    }
  }, [profile])

  // Redirect if not authenticated or not a mentor
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login')
    } else if (profile && profile.user_type !== 'mentor') {
      navigate('/profile')
    }
  }, [user, profile, authLoading, navigate])

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(pageRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      })

      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 50,
              scale: 0.95,
              rotationX: -15
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.8,
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
  }, [mentorData])

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaveSuccess(false)
  }

  const handlePhotoUpload = async (file: File) => {
    if (!user?.id) return

    try {
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

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

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

  const addArrayItem = (field: 'expertise' | 'languages' | 'specializations' | 'achievements', value: string) => {
    if (!value.trim()) return
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
    // Clear input
    if (field === 'expertise') setNewExpertise('')
    if (field === 'languages') setNewLanguage('')
    if (field === 'specializations') setNewSpecialization('')
    if (field === 'achievements') setNewAchievement('')
  }

  const removeArrayItem = (field: 'expertise' | 'languages' | 'specializations' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Update or create mentor profile
      const mentorUpdate = {
        user_id: user.id,
        title: formData.title,
        expertise: formData.expertise,
        experience_years: formData.experience_years,
        hourly_rate: formData.hourly_rate,
        languages: formData.languages,
        education: formData.education,
        company: formData.company,
        response_time: formData.response_time,
        specializations: formData.specializations,
        achievements: formData.achievements,
        updated_at: new Date().toISOString()
      }

      if (mentorData) {
        // Update existing mentor profile
        const { error: mentorError } = await supabase
          .from('mentors')
          .update(mentorUpdate)
          .eq('user_id', user.id)

        if (mentorError) throw mentorError
      } else {
        // Create new mentor profile
        const { error: mentorError } = await supabase
          .from('mentors')
          .insert(mentorUpdate)

        if (mentorError) throw mentorError
      }

      setSaveSuccess(true)
      toast({
        title: 'Success',
        description: 'Mentor profile updated successfully',
      })

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
    { key: 'title', label: 'Professional Title', completed: !!formData.title },
    { key: 'expertise', label: 'Expertise Areas', completed: formData.expertise.length > 0 },
    { key: 'hourly_rate', label: 'Hourly Rate', completed: formData.hourly_rate > 0 },
    { key: 'bio', label: 'Professional Bio', completed: !!formData.bio },
    { key: 'avatar', label: 'Profile Photo', completed: !!formData.avatar_url }
  ]

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading mentor profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Mentor Profile Settings</h1>
          <p className="text-muted-foreground">Manage your mentor profile and professional information</p>
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
                  currentPhoto={formData.avatar_url || profile?.avatar_url || null}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <Card ref={(el) => { cardRefs.current[3] = el }}>
              <CardHeader>
                <CardTitle>Mentor Information</CardTitle>
                <CardDescription>
                  Update your professional mentor profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="expertise">Expertise</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
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
                    </div>

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

                  <TabsContent value="professional" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Professional Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Current company"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience_years">Years of Experience</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={formData.experience_years}
                          onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                          className="transition-all focus:scale-[1.02]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response_time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Response Time
                        </Label>
                        <Input
                          id="response_time"
                          value={formData.response_time}
                          onChange={(e) => handleInputChange('response_time', e.target.value)}
                          placeholder="e.g., Within 2 hours"
                          className="transition-all focus:scale-[1.02]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Education
                      </Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        placeholder="e.g., BS Computer Science, MIT"
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about your professional background and mentoring approach..."
                        rows={6}
                        maxLength={1000}
                        className="transition-all focus:scale-[1.01]"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {formData.bio.length}/1000 characters
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="expertise" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label>Expertise Areas</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addArrayItem('expertise', newExpertise)
                            }
                          }}
                          placeholder="Add expertise area"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem('expertise', newExpertise)}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.expertise.map((item, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {item}
                            <button
                              onClick={() => removeArrayItem('expertise', index)}
                              className="hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Specializations</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addArrayItem('specializations', newSpecialization)
                            }
                          }}
                          placeholder="Add specialization (e.g., React, Node.js)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem('specializations', newSpecialization)}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.specializations.map((item, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {item}
                            <button
                              onClick={() => removeArrayItem('specializations', index)}
                              className="hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addArrayItem('languages', newLanguage)
                            }
                          }}
                          placeholder="Add language"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem('languages', newLanguage)}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.languages.map((item, index) => (
                          <Badge key={index} variant="outline" className="gap-2">
                            {item}
                            <button
                              onClick={() => removeArrayItem('languages', index)}
                              className="hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Achievements</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addArrayItem('achievements', newAchievement)
                            }
                          }}
                          placeholder="Add achievement or certification"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem('achievements', newAchievement)}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {formData.achievements.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                            <span className="text-sm">{item}</span>
                            <button
                              onClick={() => removeArrayItem('achievements', index)}
                              className="hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4 mt-6">
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          Hourly Rate
                        </CardTitle>
                        <CardDescription>
                          Set your hourly rate for mentoring sessions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.hourly_rate}
                              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                              className="text-2xl font-bold border-2"
                              placeholder="0.00"
                            />
                            <span className="text-lg text-muted-foreground">/hour</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Recommended range: $30 - $150/hour based on experience
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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

