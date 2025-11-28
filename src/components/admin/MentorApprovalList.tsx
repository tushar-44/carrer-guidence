import { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, User, Mail, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export function MentorApprovalList() {
  const { mentorApplications, loading, fetchMentorApplications, approveMentor, rejectMentor } = useAdminStore();
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMentorApplications();
  }, []);

  const handleAction = async () => {
    if (!selectedMentor || !actionType) return;

    setProcessing(true);
    try {
      if (actionType === 'approve') {
        await approveMentor(selectedMentor, reason || 'Approved by admin');
        toast.success('Mentor approved successfully');
      } else {
        if (!reason.trim()) {
          toast.error('Please provide a reason for rejection');
          return;
        }
        await rejectMentor(selectedMentor, reason);
        toast.success('Mentor rejected');
      }
      setSelectedMentor(null);
      setActionType(null);
      setReason('');
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const pendingApplications = mentorApplications.filter(m => m.vettingStatus === 'pending');
  const approvedMentors = mentorApplications.filter(m => m.vettingStatus === 'approved');
  const rejectedMentors = mentorApplications.filter(m => m.vettingStatus === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedMentors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedMentors.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Mentor Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((mentor) => (
                <div key={mentor.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{mentor.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{mentor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{mentor.experience}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setSelectedMentor(mentor.id);
                          setActionType('approve');
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedMentor(mentor.id);
                          setActionType('reject');
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!selectedMentor} onOpenChange={() => {
        setSelectedMentor(null);
        setActionType(null);
        setReason('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Mentor' : 'Reject Mentor'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Optionally provide a note for this approval.'
                : 'Please provide a reason for rejection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                {actionType === 'approve' ? 'Note (Optional)' : 'Reason *'}
              </Label>
              <Textarea
                id="reason"
                placeholder={actionType === 'approve' 
                  ? 'Add any notes about this approval...'
                  : 'Explain why this application is being rejected...'}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMentor(null);
                  setActionType(null);
                  setReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={processing || (actionType === 'reject' && !reason.trim())}
                variant={actionType === 'approve' ? 'default' : 'destructive'}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'approve' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}