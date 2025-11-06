import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface VerifyUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const VerifyUserDialog: React.FC<VerifyUserDialogProps> = ({ open, onOpenChange, onConfirm, isPending }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify User</DialogTitle>
          <DialogDescription>
            Are you sure you want to verify this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isPending} className="bg-green-600 hover:bg-green-700">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
