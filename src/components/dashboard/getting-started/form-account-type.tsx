import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import React from 'react';

import { UseFormReturn } from 'react-hook-form';

interface AccountTypeProps {
  form: UseFormReturn<any>;
}

const FormAccountType: React.FC<AccountTypeProps> = ({ form }) => {
  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Account Type</h2>
        <p className="text-[14px]/5  text-[#71748C]">Let us know how you intend to use Geoplux.</p>
      </div>

      <FormField
        control={form.control}
        name="accountType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="w-full flex-col gap-4">
                <div
                  className={cn(
                    'flex items-center justify-between gap-3 self-stretch rounded-[5px] border p-6 transition-colors hover:border-[#D4AF36]',
                    form.getValues().accountType === 'owner'
                      ? 'border-[#D4AF36] drop-shadow-[0_0_5px_rgba(212,175,54,0.6)]'
                      : 'border-[#F1F1F4]'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-8 items-center justify-center rounded-sm bg-[#FBF7EB]">
                        <User className="size-5  text-[#D4AF36]" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="owner"
                          className="cursor-pointer text-[16px] leading-[19px] font-semibold text-[#41415A]"
                        >
                          Property Owner
                        </label>
                        <p className="text-[12px]/3.5  text-[#71748C]">
                          I want to list, manage, and monitor my properties
                        </p>
                      </div>
                    </div>
                  </div>

                  <RadioGroupItem value="owner" id="owner" />
                </div>

                <div
                  className={cn(
                    'flex items-center justify-between gap-3 self-stretch rounded-[5px] border p-6 transition-colors hover:border-[#D4AF36]',
                    form.getValues().accountType === 'developer'
                      ? 'border-[#D4AF36] drop-shadow-[0_0_5px_rgba(212,175,54,0.6)]'
                      : 'border-[#F1F1F4]'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-8 items-center justify-center rounded-sm bg-[#FBF7EB]">
                        <User className="size-5  text-[#D4AF36]" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="developer"
                          className="cursor-pointer text-[16px] leading-[19px] font-semibold text-[#41415A]"
                        >
                          Property Developer
                        </label>
                        <p className="text-[12px]/3.5  text-[#71748C]">
                          I run a real estate company and would like to list my properties.
                        </p>
                      </div>
                    </div>
                  </div>

                  <RadioGroupItem value="developer" id="developer" />
                </div>

                <div
                  className={cn(
                    'flex items-center justify-between gap-3 self-stretch rounded-[5px] border p-6 transition-colors hover:border-[#D4AF36]',
                    form.getValues().accountType === 'client'
                      ? 'border-[#D4AF36] drop-shadow-[0_0_5px_rgba(212,175,54,0.6)]'
                      : 'border-[#F1F1F4]'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-8 items-center justify-center rounded-sm bg-[#FBF7EB]">
                        <User className="size-5  text-[#D4AF36]" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="client"
                          className="cursor-pointer text-[16px] leading-[19px] font-semibold text-[#41415A]"
                        >
                          Property Seeker
                        </label>
                        <p className="text-[12px]/3.5  text-[#71748C]">
                          I want to buy, lease or rent properties
                        </p>
                      </div>
                    </div>
                  </div>
                  <RadioGroupItem value="client" id="client" />
                </div>

                <div
                  className={cn(
                    'flex items-center justify-between gap-3 self-stretch rounded-[5px] border p-6 transition-colors hover:border-[#D4AF36]',
                    form.getValues().accountType === 'agent'
                      ? 'border-[#D4AF36] drop-shadow-[0_0_5px_rgba(212,175,54,0.6)]'
                      : 'border-[#F1F1F4]'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-8 items-center justify-center rounded-sm bg-[#FBF7EB]">
                        <User className="size-5  text-[#D4AF36]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="agent"
                          className="cursor-pointer text-[16px] leading-[19px] font-semibold text-[#41415A]"
                        >
                          Agent
                        </label>
                        <p className="text-[12px]/3.5  text-[#71748C]">
                          I want to reach out and connect with sellers for my clients.
                        </p>
                      </div>
                    </div>
                  </div>
                  <RadioGroupItem value="agent" id="agent" />
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormAccountType;
