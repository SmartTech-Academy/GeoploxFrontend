import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Upload, XIcon } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { UseFormReturn } from 'react-hook-form';
import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from '@/components/ui/kibo-ui/image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import assets from '@/assets';
import { UserProfile } from '@/lib/types';
import statesAndLgasData from '@/data/statesAndLocalGov.json';

interface AccountTypeProps {
  form: UseFormReturn<any>;
  profileData: UserProfile | undefined;
}

const PersonalInfo: React.FC<AccountTypeProps> = ({ form, profileData }) => {
  const [picturePreview, setPicturePreview] = useState<string | null>(() => profileData?.display_picture_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(form.getValues().state);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lgas = useMemo(() => {
    if (!selectedState) {
      return [];
    }
    const stateData = statesAndLgasData.find((s) => s.state === selectedState);
    return stateData ? stateData.lgas : [];
  }, [selectedState]);

  useEffect(() => {
    if (profileData) {
      form.setValue('firstName', profileData.firstname || '');
      form.setValue('lastName', profileData.lastname || '');
      form.setValue('phoneNumber', profileData.phone_number || '');
      form.setValue('whatsappNumber', profileData.whatsapp_number || '');
      form.setValue('homeAddress', profileData.home_address || '');
      form.setValue('state', profileData.state || '');
      form.setValue('localGovernment', profileData.local_gov_area || '');
    }
  }, [profileData, form]);

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCropDialogOpen(true);
    }
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

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Personal Information</h2>
        <p className="text-[14px]/5  text-[#71748C]">Let us know more about you</p>
      </div>

      <div className="flex items-center justify-between self-stretch border-b border-[#F1F1F4] pb-8 text-center">
        <div className="mx-auto flex flex-col gap-6">
          <div
            onClick={handleLogoClick}
            className="relative mx-auto flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D5D5DD]"
          >
            {picturePreview ? (
              <img src={picturePreview} alt="Profile Preview" className="size-full  object-cover" />
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
            <p className="text-[14px]/6  text-[#1F2130]">Profile Picture</p>
            <p className="text-[14px]/6  text-[#71748C]">
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
                    <Phone className="absolute top-1/2 right-3 size-4  -translate-y-1/2 transform fill-[#71748C] text-[#71748C]" />
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
                <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Locality/Area</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedState || lgas.length === 0}
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
  );
};

export default PersonalInfo;
