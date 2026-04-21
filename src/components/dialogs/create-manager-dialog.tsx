import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customResolver } from "@/lib/customZodResolver";
import { useRegisterManager } from "@/lib/services/managers";
import z from "zod/v4";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const createManagerSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email("Enter a valid email address"),
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CreateManagerFormValues = z.infer<typeof createManagerSchema>;

export function CreateManagerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<CreateManagerFormValues>({
    resolver: customResolver(createManagerSchema),
    defaultValues: {
      fname: "",
      lname: "",
      phone: "",
      email: "",
      username: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { mutate: registerManager, isPending } = useRegisterManager();

  const [showPassword, setShowPassword] = React.useState(false);

  function onSubmit(values: CreateManagerFormValues) {
    registerManager(values, {
      onSuccess: (res: any) => {
        const activationCode = res?.data?.data?.activation_code;

        if (activationCode) toast.info(`Activation code: ${activationCode}`);

        onOpenChange(false); // ✅ will now actually close
        form.reset();
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Manager</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="09169088711"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="micheal@gmail.com"
                        type="email"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="micheal"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter password"
                          type={showPassword ? "text" : "password"}
                          className="h-10 rounded-lg border-[#D5D5DD] pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-[12px] font-semibold text-primary hover:underline"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className={"text-primary"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                className="border border-[oklch(0.235_0_0/50%)] text-white"
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
