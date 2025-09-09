import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { Dispatch, SetStateAction } from 'react';

import { toast } from 'sonner';

interface DeletePropertyProps {
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  openDeleteModal: boolean;
}

const DeleteProperty: React.FC<DeletePropertyProps> = ({ setOpenDeleteModal, openDeleteModal }) => {
  const handleDelete = () => {
    // Show success toast
    const toastId = toast.success('Property Deleted Successfully', {
      description: 'Property "456 Market Avenue" has been successfully deleted.',
      action: {
        label: 'Dismiss',
        onClick: () => toast.dismiss(toastId),
      },
    });
  };
  return (
    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <p className="text-[16px] leading-[22px] text-[#41415A]">
            Are you sure you want to delete “456 Market Avenue”?
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="h-8 rounded-[32px] bg-[#F1F1F4] px-4 py-[15px] text-[12px] leading-[14px] font-semibold text-[#1F2130]"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            type="submit"
            variant="destructive"
            style={{
              background: 'linear-gradient(180deg, #F53A3D 0%, #BE001E 60%)',

              boxShadow: ' 0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-8 rounded-[32px] border border-[oklch(0.5477_0.2177_21.48_/_50%)] p-4 text-[12px] leading-[14px] font-semibold text-white"
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProperty;
