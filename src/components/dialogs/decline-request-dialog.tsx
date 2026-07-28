import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { customResolver } from "@/lib/customZodResolver";
import { Loader2 } from "lucide-react";

const declineSchema = z.object({
  reason: z.string().min(10, "Please provide a reason for declining (min. 10 characters)."),
});

type DeclineFormData = z.infer<typeof declineSchema>;

interface DeclineRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export const DeclineRequestDialog: React.FC<DeclineRequestDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}) => {
  const form = useForm<DeclineFormData>({
    resolver: customResolver(declineSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = (data: DeclineFormData) => {
    onConfirm(data.reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline Request</DialogTitle>
          <DialogDescription>Please provide a reason for declining this request.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Reason for declining..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Decline
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
