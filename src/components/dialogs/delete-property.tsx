import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

interface DeletePropertyProps {
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  openDeleteModal: boolean;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteProperty: React.FC<DeletePropertyProps> = ({
  setOpenDeleteModal,
  openDeleteModal,
  onConfirm,
  isDeleting,
}) => {
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
              className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[12px] leading-3.5 font-semibold text-[#1F2130]"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            type="submit"
            variant="destructive"
            style={{
              background: 'linear-gradient(180deg, #F53A3D 0%, #BE001E 60%)',

              boxShadow: ' 0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-8 rounded-4xl border border-[oklch(0.5477_0.2177_21.48_/_50%)] p-4 text-[12px] leading-3.5 font-semibold text-white"
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProperty;
