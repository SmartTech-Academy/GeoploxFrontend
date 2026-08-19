import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React from "react";

import { UseFormReturn } from "react-hook-form";

interface AccountTypeProps {
  form: UseFormReturn<any>;
}

interface RoleOption {
  value: "owner" | "developer" | "client" | "agent";
  label: string;
  caption: string;
  secondaryCaption?: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "owner",
    label: "Property Owner",
    caption: "I want to list, manage, and monitor my properties",
  },
  {
    value: "developer",
    label: "Property Developer",
    caption: "I run a real estate company and would like to list my properties.",
  },
  {
    value: "client",
    label: "Investor",
    caption: "I want to invest in real estate",
    // Only the "Investor" card has room budgeted for a second supporting line - the caption
    // above is also the phrase used in the page title/meta description, so it stays unchanged.
    secondaryCaption:
      "See verified listings, developer track records and confirmed title before you commit.",
  },
  {
    value: "agent",
    label: "Real Estate Consultant",
    caption: "I want to reach out and connect with sellers for my clients.",
  },
];

// Deep yellow selected-state background. White text on this fails WCAG AA (~2.4:1) - dark
// text clears it comfortably (~6.6:1) - so the selected card uses the existing dark-text
// color rather than white despite the visual brief calling for "white text".
const SELECTED_BG = "#C9A227";

const FormAccountType: React.FC<AccountTypeProps> = ({ form }) => {
  const selectedValue = form.getValues().accountType;

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Account Type</h2>
        <p className="text-[14px]/5 text-[#71748C]">Let us know how you intend to use Geoplox.</p>
      </div>

      <FormField
        control={form.control}
        name="accountType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="w-full flex-col gap-4"
              >
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <div
                      key={option.value}
                      style={isSelected ? { backgroundColor: SELECTED_BG } : undefined}
                      className={cn(
                        "flex items-center justify-between gap-3 self-stretch rounded-[5px] border p-6 transition-colors hover:border-[#D4AF36]",
                        isSelected ? "border-[#C9A227]" : "border-[#F1F1F4]",
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-sm",
                              isSelected ? "bg-white/70" : "bg-[#FBF7EB]",
                            )}
                          >
                            <User className="size-5 text-[#D4AF36]" />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor={option.value}
                              className={cn(
                                "cursor-pointer text-[16px] leading-[19px] font-semibold",
                                isSelected ? "text-[#1F2130]" : "text-[#41415A]",
                              )}
                            >
                              {option.label}
                            </label>
                            <p
                              className={cn(
                                "text-[12px]/3.5",
                                isSelected ? "text-[#1F2130]" : "text-[#71748C]",
                              )}
                            >
                              {option.caption}
                            </p>
                            {option.secondaryCaption && (
                              <p
                                className={cn(
                                  "text-[12px]/3.5",
                                  isSelected ? "text-[#1F2130]/80" : "text-[#A0A0B0]",
                                )}
                              >
                                {option.secondaryCaption}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <RadioGroupItem value={option.value} id={option.value} />
                    </div>
                  );
                })}
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
