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

interface ApproveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  requestType: 'KYC' | 'Listing' | string;
}

export const ApproveRequestDialog: React.FC<ApproveRequestDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  requestType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this {requestType} request? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isPending} className="bg-green-600 hover:bg-green-700">
            {isPending && <Loader2 className="mr-2 size-4  animate-spin" />}
            Yes, Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
