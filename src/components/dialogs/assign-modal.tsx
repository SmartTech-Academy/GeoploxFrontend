import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Dispatch, SetStateAction } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { customResolver } from '@/lib/customZodResolver';
import z from 'zod/v4';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAssignUsersToManager, useGetOwnersAndDevelopers } from '@/lib/services/managers';
import { toast } from 'sonner';
import React, { useMemo, useState } from 'react';

interface AssignModalProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  managerId?: string;
  managerName?: string;
}

const assignSchema = z.object({
  user_ids: z.array(z.string()).min(1, 'Please select at least one user'),
});

type AssignFormValues = z.infer<typeof assignSchema>;

const AssignModal: React.FC<AssignModalProps> = ({ open, onOpenChange, managerId, managerName }) => {
  const { data: ownersDevsData, isLoading } = useGetOwnersAndDevelopers();
  const [search, setSearch] = useState('');

  const form = useForm<AssignFormValues>({
    resolver: customResolver(assignSchema),
    defaultValues: {
      user_ids: [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { mutate: assignUsers, isPending } = useAssignUsersToManager({
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
      setSearch('');
    },
  });

  const users = useMemo(() => {
    const list = ownersDevsData?.data?.data || [];
    return Array.isArray(list) ? list : [];
  }, [ownersDevsData]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u: any) => {
      const fullName = `${u?.fname || ''} ${u?.lname || ''}`.trim().toLowerCase();
      return fullName.includes(q);
    });
  }, [users, search]);

  function onSubmit(values: AssignFormValues) {
    if (!managerId) {
      toast.error('Select a manager first.');
      return;
    }
    assignUsers({ manager_id: managerId, user_ids: values.user_ids });
  }

  const toggleUser = (userId: string) => {
    const current = form.getValues('user_ids');
    const next = current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId];
    form.setValue('user_ids', next, { shouldValidate: true });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          form.reset();
          setSearch('');
        }
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Assign Users</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[12px] text-[#71748C]">
                  {managerName ? `Assigning to: ${managerName}` : 'Select a manager to assign users.'}
                </p>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="h-10 rounded-lg border-[#D5D5DD]"
                />
              </div>

              <FormField
                control={form.control}
                name="user_ids"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Owners / Developers
                    </FormLabel>
                    <FormControl>
                      <div className="max-h-64 overflow-y-auto rounded-lg border border-[#E8E8E8] bg-white p-3">
                        {isLoading ? (
                          <p className="text-[12px] text-[#71748C]">Loading...</p>
                        ) : filteredUsers.length === 0 ? (
                          <p className="text-[12px] text-[#71748C]">No users found.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {filteredUsers.map((u: any) => {
                              const id = u?.id;
                              const name = `${u?.fname || ''} ${u?.lname || ''}`.trim();
                              const checked = !!id && form.getValues('user_ids').includes(id);
                              return (
                                <div key={id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#F9F9FB]">
                                  <Checkbox
                                    id={id}
                                    checked={checked}
                                    onCheckedChange={() => (id ? toggleUser(id) : null)}
                                  />
                                  <Label htmlFor={id} className="cursor-pointer text-[14px] text-[#1F2130]">
                                    {name || 'Unnamed'}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        )}
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
                  className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[12px]/3.5  font-semibold text-[#1F2130]"
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
                disabled={isPending || !managerId}
                className="h-8 rounded-4xl border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3.5  font-semibold text-white"
              >
                {isPending ? 'Assigning...' : 'Assign'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default AssignModal;
