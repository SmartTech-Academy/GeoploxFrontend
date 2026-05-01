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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAssignUsersToManager,
  useAssignRegionToManager,
  useGetOwnersDevelopers,
} from "@/lib/services/managers";

import { toast } from "sonner";
import React, { useId, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import statesAndLocalGov from "@/data/statesAndLocalGov.json";

interface AssignModalProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  managerId?: string;
  managerName?: string;
}

interface User {
  id: string;
  fname: string;
  lname: string;
}

// Schema handles both modes.
const assignSchema = z.object({
  user_ids: z.array(z.string()).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

type AssignFormValues = z.infer<typeof assignSchema>;

const AssignModal: React.FC<AssignModalProps> = ({
  open,
  onOpenChange,
  managerId,
  // managerName,
}) => {
  const formId = useId();
  const [search, setSearch] = useState("");
  const [assignmentMode, setAssignmentMode] = useState<"region" | "users">("region");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: usersData,
    isPending: isLoadingUserData,
    isFetching,
  } = useGetOwnersDevelopers(
    {
      status: "all",
      search_user: debouncedSearch || undefined,
    },
    { enabled: open && assignmentMode === "users" },
  );
  const users: User[] = usersData?.data?.data ?? [];

  const form = useForm<AssignFormValues>({
    resolver: customResolver(assignSchema),
    defaultValues: {
      user_ids: [],
      state: "",
      city: "",
    },
    mode: "onChange",
  });

  // Hooks for API calls
  const { mutate: assignUsers, isPending: isAssigningUsers } = useAssignUsersToManager();
  const { mutate: assignRegion, isPending: isAssigningRegion } = useAssignRegionToManager();

  const isPending = isAssigningUsers || isAssigningRegion;

  function onSubmit(values: AssignFormValues) {
    if (!managerId) {
      toast.error("Select a manager first.");
      return;
    }

    if (assignmentMode === "region") {
      if (!values.state || !values.city) {
        toast.error("Please select both State and Region.");
        return;
      }
      assignRegion(
        { manager_id: managerId, state: values.state, city: values.city },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    } else {
      if (!values.user_ids || values.user_ids.length === 0) {
        toast.error("Please select at least one user.");
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
  }

  const toggleUser = (userId: string) => {
    const current = form.getValues("user_ids") || [];
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    form.setValue("user_ids", next, { shouldValidate: true });
  };

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSearch("");
      setAssignmentMode("region");
    }
  }, [open, form]);

  // Get LGAs for selected state
  const selectedStateValue = form.watch("state");
  const selectedStateData = statesAndLocalGov.find((s) => s.state === selectedStateValue);
  // Adjust based on your JSON structure (usually .lgas or similar)
  const availableLgas = selectedStateData ? (selectedStateData as any).lgas : [];

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
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign By</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-6">
              {/* Mode Toggles */}
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F8F8F8] p-1">
                <button
                  type="button"
                  onClick={() => setAssignmentMode("region")}
                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    assignmentMode === "region"
                      ? "bg-white text-[#D4AF36] shadow-sm"
                      : "text-[#71748C] hover:text-[#1F2130]"
                  }`}
                >
                  Region
                  {assignmentMode === "region" && (
                    <div className="h-2 w-2 rounded-full bg-[#D4AF36]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAssignmentMode("users")}
                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    assignmentMode === "users"
                      ? "bg-white text-[#D4AF36] shadow-sm"
                      : "text-[#71748C] hover:text-[#1F2130]"
                  }`}
                >
                  Developer/ Owner
                  {assignmentMode === "users" && (
                    <div className="h-2 w-2 rounded-full bg-[#D4AF36]" />
                  )}
                </button>
              </div>

              {/* REGION MODE CONTENT */}
              {assignmentMode === "region" && (
                <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 duration-200">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-[14px] text-[#41415A]">Select State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statesAndLocalGov.map((s) => (
                              <SelectItem key={s.state} value={s.state}>
                                {s.state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-[14px] text-[#41415A]">Select Region</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedStateValue}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableLgas.map((lga: string) => (
                              <SelectItem key={lga} value={lga}>
                                {lga}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!selectedStateValue && (
                          <p className="text-[10px] text-[#71748C]">Please select a state first.</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* DEVELOPER/OWNER MODE CONTENT */}
              {assignmentMode === "users" && (
                <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 duration-200">
                  <div className="flex flex-col gap-2">
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
                        <FormLabel className="text-[14px] font-normal text-[#41415A]">
                          Select User(s)
                        </FormLabel>
                        <FormControl>
                          <div className="max-h-64 overflow-y-auto rounded-lg border border-[#E8E8E8] bg-white p-3">
                            {isLoadingUserData ? (
                              <p className="text-[12px] text-[#71748C]">Loading...</p>
                            ) : isFetching ? (
                              <p className="text-[12px] text-[#71748C]">Searching...</p>
                            ) : users.length === 0 ? (
                              <p className="text-[12px] text-[#71748C]">No users found.</p>
                            ) : (
                              <div className="flex flex-col gap-2">
                                {users.map((u: User) => {
                                  const checked = (form.getValues("user_ids") || []).includes(u.id);
                                  return (
                                    <div
                                      key={u.id}
                                      className="flex items-center gap-3 rounded-md p-2 hover:bg-[#F9F9FB]"
                                    >
                                      <Checkbox
                                        id={u.id}
                                        checked={checked}
                                        onCheckedChange={() => toggleUser(u.id)}
                                      />
                                      <Label
                                        htmlFor={u.id}
                                        className="cursor-pointer text-[14px] text-[#1F2130]"
                                      >
                                        {`${u.lname} ${u.fname}`}
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
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-4xl bg-[#F1F1F4] px-6 text-[12px] font-semibold text-[#1F2130]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form={formId}
                disabled={isPending || !managerId}
                className="h-9 rounded-4xl bg-[#1F2130] px-6 text-[12px] font-semibold text-white hover:bg-[#1F2130]/90"
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
