import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { customResolver } from '@/lib/customZodResolver';
import z from 'zod/v4';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AssignModalProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const assignSchema = z.object({
  assignType: z.enum(['region', 'developer'], {
    error: 'Please select an assignment type',
  }),
  state: z.string().min(1, 'Please select a state'),
  selectedRegions: z.array(z.string()).min(1, 'Please select at least one region'),
});

const AssignModal: React.FC<AssignModalProps> = ({ open, onOpenChange }) => {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const form = useForm({
    resolver: customResolver(assignSchema),
    defaultValues: {
      assignType: 'region' as const,
      state: 'lagos',
      selectedRegions: ['lagos-mainland'],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Mock data - replace with actual data
  const states = [
    { value: 'lagos', label: 'Lagos State' },
    { value: 'abuja', label: 'FCT Abuja' },
    { value: 'rivers', label: 'Rivers State' },
  ];

  const regions = [
    { value: 'lekki-ajah', label: 'Lekki–Ajah Axis' },
    { value: 'lagos-island', label: 'Lagos Island' },
    { value: 'lagos-mainland', label: 'Lagos Mainland' },
  ];

  function onSubmit(values: z.infer<typeof assignSchema>) {
    toast.success(values.assignType);
    onOpenChange(false);
  }

  const handleRegionToggle = (regionValue: string) => {
    const currentRegions = form.getValues('selectedRegions');
    const updatedRegions = currentRegions.includes(regionValue)
      ? currentRegions.filter((r) => r !== regionValue)
      : [...currentRegions, regionValue];

    form.setValue('selectedRegions', updatedRegions);
  };

  const getSelectedRegionsText = () => {
    const selectedRegions = form.getValues('selectedRegions');
    if (selectedRegions.length === 0) return 'Select regions';
    if (selectedRegions.length === 1) {
      const region = regions.find((r) => r.value === selectedRegions[0]);
      return region?.label || 'Select regions';
    }
    return `${selectedRegions.length} regions selected`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle> Assign By</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-5">
              <FormField
                control={form.control}
                name="assignType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div
                          className={cn(
                            `flex w-full grow items-center justify-between gap-4 rounded-[5px] px-4 py-6`,
                            field.value === 'region' ? 'bg-[#FBF7EB]' : 'border border-[#F1F1F4] bg-white'
                          )}
                        >
                          <Label
                            htmlFor="region"
                            className="cursor-pointer text-[14px] leading-[17px] font-semibold text-[#4E4E4E]"
                          >
                            Region
                          </Label>

                          <RadioGroupItem value="region" id="region" />
                        </div>

                        <div
                          className={cn(
                            `flex w-full grow items-center justify-between gap-4 rounded-[5px] px-4 py-6`,
                            field.value === 'developer' ? 'bg-[#FBF7EB]' : 'border border-[#F1F1F4] bg-white'
                          )}
                        >
                          <Label
                            htmlFor="developer"
                            className="cursor-pointer text-[14px] leading-[17px] font-semibold text-[#4E4E4E]"
                          >
                            Developer/ Owner
                          </Label>
                          <RadioGroupItem value="developer" id="developer" />
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Select State
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
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
                name="selectedRegions"
                render={() => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Select Region
                    </FormLabel>
                    <FormControl>
                      <Popover open={regionDropdownOpen} onOpenChange={setRegionDropdownOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={regionDropdownOpen}
                            className="h-10 w-full justify-between rounded-xl border-gray-300 bg-white text-base font-medium text-gray-800 hover:bg-white"
                          >
                            {getSelectedRegionsText()}
                            <ChevronDown className="size-4 fill-[#41415A] opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" align="start">
                          <div className="flex w-full flex-col gap-4 p-4">
                            {regions.map((region) => {
                              const isChecked = form.getValues('selectedRegions').includes(region.value);
                              return (
                                <div key={region.value} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={region.value}
                                    checked={isChecked}
                                    onCheckedChange={() => handleRegionToggle(region.value)}
                                  />
                                  <Label
                                    htmlFor={region.value}
                                    className={`cursor-pointer text-base font-medium ${
                                      isChecked ? 'text-gray-800' : 'text-gray-500'
                                    }`}
                                  >
                                    {region.label}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
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
                className="h-8 rounded-4xl border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3.5  font-semibold text-white"
              >
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default AssignModal;
