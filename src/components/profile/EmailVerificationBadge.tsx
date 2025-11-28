import { CheckCircle2, XCircle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function EmailVerificationBadge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isVerified] = useState(user?.email_confirmed_at ? true : false);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsSending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and click the verification link'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification email',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <span className="text-sm font-medium text-green-500">Email Verified</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <XCircle className="w-5 h-5 text-yellow-500" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-yellow-500">Email Not Verified</span>
          <span className="text-xs text-muted-foreground">
            Please verify your email to access all features
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleResendVerification}
        disabled={isSending}
        className="gap-2"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Resend
          </>
        )}
      </Button>
    </div>
  );
}

