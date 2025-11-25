import assets from '@/assets';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from '@/components/ui/kibo-ui/image-crop';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { customResolver } from '@/lib/customZodResolver';
import { useUpdatePersonalInformation } from '@/lib/services/profile';
import { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Phone, Upload, XIcon } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import statesAndLgasData from '@/data/statesAndLocalGov.json';

const step2Schema = z.object({
  profilePicture: z.any().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(11, 'Phone number must be 11 digits'),
  whatsappNumber: z.string().min(11, 'WhatsApp number must be 11 digits'),
  homeAddress: z.string().min(1, 'Home address is required'),
  state: z.string().min(1, 'State is required'),
  localGovernment: z.string().min(1, 'Locality/Area is required'),
  bio: z.string().optional(),
});

type PersonalInfoFormValues = z.infer<typeof step2Schema>;

interface PersonalInformationSectionProps {
  user: UserProfile | undefined;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({ user }) => {
  const { mutateAsync: updatePersonalInfo, isPending } = useUpdatePersonalInformation();
  const [picturePreview, setPicturePreview] = useState<string | null>(user?.display_picture_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(user?.state || undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lgas = useMemo(() => {
    if (!selectedState) {
      return [];
    }
    const stateData = statesAndLgasData.find((s) => s.state === selectedState);
    return stateData ? stateData.lgas : [];
  }, [selectedState]);

  const form = useForm<PersonalInfoFormValues>({
    resolver: customResolver(step2Schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: user?.firstname || '',
      lastName: user?.lastname || '',
      phoneNumber: user?.phone_number || '',
      whatsappNumber: user?.whatsapp_number || '',
      homeAddress: user?.home_address || '',
      state: user?.state || undefined,
      localGovernment: user?.local_gov_area || undefined,
      bio: user?.bio || '',
    },
  });

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCropDialogOpen(true);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleCrop = (croppedImage: string) => {
    setPicturePreview(croppedImage);
    form.setValue('profilePicture', croppedImage);
    setCropDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDialogClose = () => {
    setCropDialogOpen(false);
    setSelectedFile(null);
  };

  const onSubmit = async (values: PersonalInfoFormValues) => {
    try {
      await updatePersonalInfo({
        fname: values.firstName,
        lname: values.lastName,
        phone: values.phoneNumber,
        whatsapp: values.whatsappNumber,
        home_address: values.homeAddress,
        state: values.state,
        local_gov_area: values.localGovernment,
        bio: values.bio,
        base64_file: values.profilePicture,
      });
      toast.success('Personal information updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred.';
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex w-full flex-col gap-10">
          <div className="flex flex-col items-center gap-3 self-stretch text-center">
            <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Personal Information</h2>
            <p className="text-[14px] leading-5 text-[#71748C]">Update your details</p>
          </div>

          <div className="flex w-full flex-col gap-5">
            <div className="flex items-center justify-between self-stretch border-b border-[#F1F1F4] pb-8 text-center">
              <div className="mx-auto flex flex-col gap-6">
                <div
                  role="button"
                  onClick={handlePictureClick}
                  className="relative mx-auto flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D5D5DD]"
                >
                  {picturePreview ? (
                    <img
                      src={picturePreview || '/placeholder.svg'}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="size-4 text-[#71748C]" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handlePictureUpload}
                    className="sr-only"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[14px] leading-6 text-[#1F2130]">Profile Picture</p>
                  <p className="text-[14px] leading-6 text-[#71748C]">
                    Upload a profile picture. Only .JPG and .PNG supported.
                  </p>
                </div>
              </div>
            </div>
            {selectedFile && (
              <Dialog open={isCropDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crop Your Profile Picture</DialogTitle>
                  </DialogHeader>
                  <div className="flex w-full flex-col items-center justify-center space-y-4">
                    <ImageCrop
                      aspect={1}
                      file={selectedFile}
                      maxImageSize={1024 * 1024} // 1MB
                      onCrop={handleCrop}
                    >
                      <ImageCropContent className="max-w-md" />
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <ImageCropApply />
                        <ImageCropReset />
                        <Button onClick={handleDialogClose} size="icon" type="button" variant="ghost">
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                    </ImageCrop>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0805-555-3323"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
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
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Whatsapp Number
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

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full gap-1.5">
                  <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about yourself"
                      className="resize-none rounded-lg border-[#D5D5DD]"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">State</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedState(value);
                        form.setValue('localGovernment', ''); // Reset LGA on state change
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statesAndLgasData.map((state, index) => (
                          <SelectItem key={`${state.state}${index}`} value={state.state}>
                            {state.state}
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
                name="localGovernment"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Locality/Area
                    </FormLabel>
                    <Select
                      disabled={!selectedState || lgas.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lgas.map((lga, index) => (
                          <SelectItem key={`${lga}${index}`} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
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
            className="h-10 flex-1 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] text-[14px] font-semibold text-white"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInformationSection;
