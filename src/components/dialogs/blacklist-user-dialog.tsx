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

interface BlacklistUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const BlacklistUserDialog: React.FC<BlacklistUserDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Blacklist User</DialogTitle>
          <DialogDescription>
            Are you sure you want to blacklist this user? This will restrict their access to the platform.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isPending} variant="destructive">
            {isPending && <Loader2 className="mr-2 size-4  animate-spin" />}
            Yes, Blacklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
