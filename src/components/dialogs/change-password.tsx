import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { customResolver } from '@/lib/customZodResolver';
import z from 'zod/v4';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';

interface PropertyProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const ChangePassword: React.FC<PropertyProps> = ({ open, onOpenChange }) => {
  const form = useForm({
    resolver: customResolver(passwordSchema),
    defaultValues: {},
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-5">
              {/* Old Password */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder="Enter old password"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <span
                          className="text-primary absolute top-6 right-4 -translate-y-1/2 transform cursor-pointer text-[12px] leading-[14px] font-semibold hover:underline"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                        >
                          {showOldPassword ? 'Hide' : 'Show'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <span
                          className="text-primary absolute top-6 right-4 -translate-y-1/2 transform cursor-pointer text-[12px] leading-[14px] font-semibold hover:underline"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                        >
                          {showNewPassword ? 'Hide' : 'Show'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                type="submit"
                variant="default"
                style={{
                  background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                className="h-8 rounded-[32px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[12px] leading-[14px] font-semibold text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default ChangePassword;
