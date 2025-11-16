import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import type { Job } from '@/data/jobs';
import { useApplicationStore } from '@/stores/applicationStore';

interface JobApplicationModalProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobApplicationModal({ job, open, onOpenChange }: JobApplicationModalProps) {
  const { addApplication } = useApplicationStore();
  const { user } = useAuth();
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
    linkedin: '',
    portfolio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.resume) newErrors.resume = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setStep('review');
    }
  };

  const handleConfirm = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Upload resume to Supabase Storage if provided
      let resumeUrl = null;
      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resume);

        if (uploadError) throw uploadError;
        resumeUrl = uploadData.path;
      }

      // Insert application into database
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          company: job.company,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.coverLetter,
          resume_url: resumeUrl,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
          status: 'applied'
        });

      if (insertError) throw insertError;

      // Add to local store for immediate UI feedback
      addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: 'applied',
        resumeUrl: resumeUrl ? supabase.storage.from('resumes').getPublicUrl(resumeUrl).data.publicUrl : undefined,
        coverLetter: formData.coverLetter,
        notes: `Applied via CareerPath platform. LinkedIn: ${formData.linkedin}, Portfolio: ${formData.portfolio}`
      });

      setStep('success');

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        resetModal();
      }, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('form');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      resume: null,
      linkedin: '',
      portfolio: ''
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' && `Apply for ${job.title}`}
            {step === 'review' && 'Review Your Application'}
            {step === 'success' && 'Application Submitted!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-6">
            {/* Job Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant="secondary">Application Form</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="resume">Resume/CV *</Label>
                <div className="mt-1">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleInputChange('resume', e.target.files?.[0] || null)}
                    className={errors.resume ? 'border-red-500' : ''}
                  />
                  {errors.resume && (
                    <p className="text-sm text-red-500 mt-1">{errors.resume}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're interested in this position..."
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio/Website</Label>
                  <Input
                    id="portfolio"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Review Application
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            {/* Application Review */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{job.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{job.company}</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  )}
                  {formData.resume && (
                    <div>
                      <p className="text-sm text-muted-foreground">Resume</p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{formData.resume.name}</span>
                      </div>
                    </div>
                  )}
                  {formData.coverLetter && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cover Letter</p>
                      <p className="font-medium text-sm bg-muted p-2 rounded max-h-20 overflow-y-auto">
                        {formData.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Before submitting:</h4>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Double-check all information is accurate</li>
                    <li>• Ensure your resume is up to date</li>
                    <li>• You can update your application within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep('form')}>
                Edit Application
              </Button>
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted successfully.
                You'll receive a confirmation email shortly.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application ID</span>
                    <span className="font-medium font-mono">APP-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary">Under Review</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Steps</span>
                    <span className="font-medium">Email confirmation sent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetModal}>
                Apply to Another Job
              </Button>
              <Button className="flex-1">
                View My Applications
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
