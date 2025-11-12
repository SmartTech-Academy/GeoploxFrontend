import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useContactPropertyOwner } from '@/lib/services';
import { toast, Toaster } from 'sonner';
import { customResolver } from '@/lib/customZodResolver';

const contactSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactOwnerDialogProps {
  propertyId: string;
  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export const ContactOwnerDialog: React.FC<ContactOwnerDialogProps> = ({ propertyId, open, onOpenChange }) => {
  const { mutate: contactOwner, isPending } = useContactPropertyOwner();

  const form = useForm<ContactFormData>({
    resolver: customResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: 'I am interested in this property and would like to know more details. Please contact me.',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactOwner(
      { propertyId, data },
      {
        onSuccess: () => {
          toast.success('Your message has been sent to the property owner.');
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Toaster />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
          <DialogDescription>Fill out the form below to send a message to the owner.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="08012345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
