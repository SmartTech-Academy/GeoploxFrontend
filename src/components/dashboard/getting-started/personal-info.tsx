import assets from '@/assets';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Phone } from 'lucide-react';
import React from 'react';

import { UseFormReturn } from 'react-hook-form';

interface AccountTypeProps {
  form: UseFormReturn<any>;
}

const PersonalInfo: React.FC<AccountTypeProps> = ({ form }) => {
  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Personal Information</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Let us know more about you</p>
      </div>

      <div className="flex w-full flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full gap-1.5">
                <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Rene" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full gap-1.5">
                <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Forbes" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full gap-1.5">
                <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="0805-555-3323" className="h-10 rounded-lg border-[#D5D5DD] pr-10" {...field} />
                    <Phone className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform fill-[#71748C] text-[#71748C]" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem className="w-full gap-1.5">
                <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Whatsapp Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="0805-555-3323" className="h-10 rounded-lg border-[#D5D5DD] pr-10" {...field} />
                    <img src={assets.whatsapp} className="absolute top-1/2 right-3 size-5 -translate-y-1/2 transform" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="homeAddress"
          render={({ field }) => (
            <FormItem className="w-full gap-1.5">
              <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Home Address</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
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
            name="localGovernment"
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
  );
};

export default PersonalInfo;
