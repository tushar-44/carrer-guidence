import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { userTypes, type UserType } from '@/constants/index';
import { useUserStore } from '@/stores/userStore';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected?: (role: UserType) => void;
}

export function RoleSelectionModal({ isOpen, onClose, onRoleSelected }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const { setUserType } = useUserStore();

  const handleRoleSelect = (role: UserType) => {
    setSelectedRole(role);
  };

  const handleConfirm = async () => {
    if (selectedRole) {
      // Update user store
      setUserType(selectedRole);

      // TODO: Update user metadata in Supabase to persist role selection
      // This would involve calling Supabase auth.updateUser() to store user_type in metadata

      onRoleSelected?.(selectedRole);
      onClose();
      setSelectedRole(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Role</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Select how you'll use CareerPath to get personalized features
          </p>
        </DialogHeader>
        <div className="space-y-3">
          {userTypes.map((role) => (
            <Button
              key={role.value}
              variant={selectedRole === role.value ? "default" : "outline"}
              className="w-full justify-start h-auto p-4 text-left"
              onClick={() => handleRoleSelect(role.value)}
            >
              <div className="text-left">
                <div className="font-semibold">{role.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{role.description}</div>
              </div>
            </Button>
          ))}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedRole}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
