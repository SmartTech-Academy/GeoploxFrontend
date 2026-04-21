import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { customResolver } from "@/lib/customZodResolver";
import z from "zod/v4";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAssignUsersToManager } from "@/lib/services/managers";
import { useGetUsers } from "@/lib/services/users";
import { toast } from "sonner";
import React, { useId, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface AssignModalProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  managerId?: string;
  managerName?: string;
}

interface User {
  codec: string;
  username: string;
  email_address: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  whatsapp_number: string | null;
  user_role: string;
  onboarding_status: "active" | "suspended" | "pending" | string;
  country: string;
  state: string | null;
  local_gov_area: string | null;
  home_address: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
  linkedin: string | null;
  display_picture_url: string;
  government_id_doc_url: string;
  bio: string | null;
  "2fa": boolean;
  approval_type: string;
  approval_request_date: string; // ISO date
  email_verified: boolean;
  email_verification_date: string | null;
  entity_creation_date: string; // ISO date
}

const assignSchema = z.object({
  user_ids: z.array(z.string()).min(1, "Please select at least one user"),
});

type AssignFormValues = z.infer<typeof assignSchema>;

const AssignModal: React.FC<AssignModalProps> = ({
  open,
  onOpenChange,
  managerId,
  managerName,
}) => {
  const formId = useId();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: usersData,
    isPending: isLoadingUserData,
    isFetching,
  } = useGetUsers(
    {
      status: "all",
      search_user: debouncedSearch || undefined,
    },
    { enabled: open },
  );
  const users: User[] = usersData?.data?.data?.users ?? [];

  const filteredUsers = users.filter((u) => u.user_role !== "manager");

  const form = useForm<AssignFormValues>({
    resolver: customResolver(assignSchema),
    defaultValues: {
      user_ids: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { mutate: assignUsers, isPending } = useAssignUsersToManager();

  function onSubmit(values: AssignFormValues) {
    if (!managerId) {
      toast.error("Select a manager first.");
      return;
    }
    assignUsers(
      { manager_id: managerId, user_ids: values.user_ids },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
          setSearch("");
        },
      },
    );
  }

  const toggleUser = (userId: string) => {
    const current = form.getValues("user_ids");
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    form.setValue("user_ids", next, { shouldValidate: true });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          form.reset();
          setSearch("");
        }
      }}
    >
      <Form {...form}>
        {/* DialogContent is portaled; wire submission via form id + button `form` attribute. */}
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Assign Users</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[12px] text-[#71748C]">
                  {managerName
                    ? `Assigning to: ${managerName}`
                    : "Select a manager to assign users."}
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
                      Users
                    </FormLabel>
                    <FormControl>
                      <div className="max-h-64 overflow-y-auto rounded-lg border border-[#E8E8E8] bg-white p-3">
                        {isLoadingUserData ? (
                          <p className="text-[12px] text-[#71748C]">Loading...</p>
                        ) : isFetching ? (
                          <p className="text-[12px] text-[#71748C]">Searching...</p>
                        ) : filteredUsers.length === 0 ? (
                          <p className="text-[12px] text-[#71748C]">No users found.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {filteredUsers.map((u: User) => {
                              const checked = form.getValues("user_ids").includes(u.codec);
                              return (
                                <div
                                  key={u.codec}
                                  className="flex items-center gap-3 rounded-md p-2  hover:bg-[#F9F9FB]"
                                >
                                  <Checkbox
                                    id={u.codec}
                                    checked={checked}
                                    onCheckedChange={() => toggleUser(u.codec)}
                                  />
                                  <Label
                                    htmlFor={u.codec}
                                    className="cursor-pointer text-[14px] text-[#1F2130]"
                                  >
                                    {`${u.lastname} ${u.firstname}`}
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
                  type="button"
                  className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[12px]/3.5 font-semibold text-[#1F2130]"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form={formId}
                variant="default"
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                disabled={isPending || !managerId}
                className="h-8 rounded-4xl border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3.5 font-semibold text-white"
              >
                {isPending ? "Assigning..." : "Assign"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default AssignModal;
