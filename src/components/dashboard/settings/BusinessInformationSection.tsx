import { Button } from '@/components/ui/button';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { customResolver } from '@/lib/customZodResolver';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import z from 'zod/v4';
import { Phone, Upload } from 'lucide-react';
import assets from '@/assets';
import React, { useRef, useState } from 'react';
import { UserProfile } from '@/lib/types';

const step3BusinessSchema = z.object({
  businessLogo: z.any().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  businessEmail: z.email('Valid email is required'),
  businessPhone: z.string().min(11, 'Business phone must be 11 digits'),
  businessWhatsapp: z.string().min(11, 'Business WhatsApp must be 11 digits'),
  website: z.string().optional(),
  instagram: z.string().optional(),
  businessAddress: z.string().min(1, 'Business address is required'),
  businessState: z.string().min(1, 'State is required'),
  businessLocalGovernment: z.string().min(1, 'Local government is required'),
});

interface BusinessInformationSectionProps {
  user: UserProfile | undefined;
}

const BusinessInformationSection: React.FC<BusinessInformationSectionProps> = ({ user }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(user?.business?.logo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: customResolver(step3BusinessSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      businessName: user?.business?.name || '',
      businessEmail: user?.business?.email || '',
      businessPhone: user?.business?.phone || '',
      businessWhatsapp: user?.business?.whatsapp || '',
      website: user?.business?.website || '',
      instagram: user?.business?.instagram || '',
      businessAddress: user?.business?.address || '',
      businessState: user?.business?.state || undefined,
      businessLocalGovernment: user?.business?.lga || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof step3BusinessSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('businessLogo', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex w-full flex-col gap-10 bg-white">
          <div className="flex flex-col items-center gap-3 self-stretch text-center">
            <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Business Information</h2>
            <p className="text-[14px] leading-[20px] text-[#71748C]">Update your business details</p>
          </div>

          <div className="flex items-center justify-between self-stretch border-b border-[#F1F1F4] pb-8 text-center">
            <div className="mx-auto flex flex-col gap-6">
              <div
                onClick={handleLogoClick}
                className="relative mx-auto flex size-[64px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D5D5DD]"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview || '/placeholder.svg'}
                    alt="Business Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload className="size-4 text-[#71748C]" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleLogoUpload}
                  className="sr-only"
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[14px] leading-[24px] text-[#1F2130]">Business Logo</p>
                <p className="text-[14px] leading-[24px] text-[#71748C]">
                  Upload a profile picture. Only .JPG and .PNG supported.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Forbes Realty" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="rene_realty@forbes.com"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Business Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0805-555-3323"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <Phone className="fill-[#71748C]] absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-[#71748C]" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessWhatsapp"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Business Whatsapp Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0805-555-3323"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <img
                          src={assets.whatsapp}
                          className="absolute top-1/2 right-3 size-5 -translate-y-1/2 transform"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="www.forbesrealty.com"
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
                name="instagram"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="http://" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem className="w-full gap-1.5">
                  <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                    Business Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="12, Oba Akinjobi Road, Ikeja GRA"
                      className="resize-none rounded-lg border-[#D5D5DD]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessState"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessLocalGovernment"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Local Government
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ikeja">Ikeja</SelectItem>
                        <SelectItem value="victoria-island">Victoria Island</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className={cn('h-10 flex-1 rounded-full bg-[#F1F1F4] text-[14px] font-semibold text-[#1F2130]')}
          >
            Back
          </Button>
          <Button
            style={{
              background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            type="submit"
            className="h-10 flex-1 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] text-[14px] font-semibold text-white"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessInformationSection;
