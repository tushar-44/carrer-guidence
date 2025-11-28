import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Loader2, User, Briefcase, Target, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const careerStages = [
  'High School Student',
  'College Student',
  'Recent Graduate',
  'Early Career (1-3 years)',
  'Mid Career (4-10 years)',
  'Senior Professional (10+ years)',
  'Career Changer',
  'Entrepreneur'
]

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Engineering',
  'Design',
  'Sales',
  'Consulting',
  'Non-profit',
  'Government',
  'Other'
]

const userTypes = [
  { value: 'graduates', label: 'Graduate/Student', description: 'Looking for career guidance and mentorship' },
  { value: 'mentor', label: 'Mentor', description: 'Experienced professional offering guidance' },
  { value: 'company', label: 'Company Representative', description: 'Hiring or representing an organization' }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    careerStage: '',
    industry: '',
    location: '',
    currentRole: '',
    experience: '',
    skills: '',
    careerGoals: ''
  })

  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate('/auth/login')
    }
  }, [session, navigate])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.userType && formData.firstName && formData.lastName
      case 2:
        return formData.bio && formData.phone
      case 3:
        return formData.careerStage && formData.industry && formData.location
      case 4:
        return formData.careerGoals
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Call the profile API to create/update profile
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          bio: formData.bio,
          user_type: formData.userType,
          career_stage: formData.careerStage,
          industry: formData.industry,
          location: formData.location,
          current_role: formData.currentRole,
          experience: formData.experience,
          skills: formData.skills,
          career_goals: formData.careerGoals
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast.success('Profile completed successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us personalize your CareerPath experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5" />}
              {currentStep === 2 && <User className="h-5 w-5" />}
              {currentStep === 3 && <Briefcase className="h-5 w-5" />}
              {currentStep === 4 && <Target className="h-5 w-5" />}
              {currentStep === 1 && 'Account Type & Basic Info'}
              {currentStep === 2 && 'Personal Details'}
              {currentStep === 3 && 'Professional Background'}
              {currentStep === 4 && 'Career Goals'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about yourself and your role on the platform'}
              {currentStep === 2 && 'Share some personal information to help us connect you better'}
              {currentStep === 3 && 'Let us know about your professional background'}
              {currentStep === 4 && 'What are your career aspirations?'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Account Type & Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">I am a...</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {userTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.userType === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('userType', type.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.userType === type.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.userType === type.value && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{type.label}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what you're looking for on CareerPath..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Professional Background */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="careerStage">Career Stage *</Label>
                  <Select value={formData.careerStage} onValueChange={(value) => handleInputChange('careerStage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current career stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State/Country"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role/Position</Label>
                  <Input
                    id="currentRole"
                    value={formData.currentRole}
                    onChange={(e) => handleInputChange('currentRole', e.target.value)}
                    placeholder="Software Engineer, Student, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g., 2 years, 5+ years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="JavaScript, Python, Leadership, etc."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Career Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="careerGoals">Career Goals *</Label>
                  <Textarea
                    id="careerGoals"
                    value={formData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    placeholder="What are your short-term and long-term career goals? What kind of help are you looking for?"
                    rows={6}
                    required
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🎯 What happens next?</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Get personalized career recommendations</li>
                    <li>• Connect with relevant mentors</li>
                    <li>• Access tailored learning resources</li>
                    <li>• Receive job opportunities matching your goals</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
