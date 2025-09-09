'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Upload, RotateCcw, Trash, X, Slash } from 'lucide-react';
import type React from 'react';
import { useState, useRef } from 'react';
import { z } from 'zod/v4';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { useForm } from 'react-hook-form';
import { customResolver } from '@/lib/customZodResolver';
import { Link, useRouter } from '@tanstack/react-router';
import { Separator } from '@/components/ui/separator';

// Zod Schema
const PropertyFormSchema = z.object({
  listingTitle: z.string().min(1, 'Listing title is required'),
  listingType: z.enum(['For Sale', 'Rent', 'Short Let'], {
    error: 'Please select a listing type',
  }),
  propertyType: z.string().min(1, 'Property type is required'),
  landType: z.string().min(1, 'Land type is required'),
  houseNumber: z.string().min(1, 'House/Apartment number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  state: z.string().min(1, 'State is required'),
  localGovernment: z.string().min(1, 'Local government is required'),
  propertyDescription: z.string().min(10, 'Property description must be at least 10 characters'),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  totalArea: z.string().min(1, 'Total area is required'),
  propertyPrice: z.string().min(1, 'Property price is required'),
  currency: z.string().min(1, 'Currency is required'),
  propertyImages: z.array(z.instanceof(File)).min(1, 'At least one property image is required'),
  documentType: z.string().optional(),
  propertyDocument: z.instanceof(File).optional(),
  nearbyAmenities: z.array(z.string()).default([]),
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

interface PropertyFormProps {
  isEdit?: boolean;
  initialData?: Partial<PropertyFormValues>;
}

const propertyTypes = [
  'Duplex',
  'Bungalow',
  'Apartment',
  'Flat',
  'Mansion',
  'Townhouse',
  'Villa',
  'Studio',
  'Penthouse',
];

const landTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed Use'];

const states = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Ogun', 'Kaduna', 'Oyo', 'Delta', 'Edo', 'Anambra'];

const localGovernments = [
  'Ikeja',
  'Victoria Island',
  'Lekki',
  'Surulere',
  'Ikoyi',
  'Yaba',
  'Gbagada',
  'Mushin',
  'Alimosho',
  'Kosofe',
];

const currencies = [
  { value: 'NGN', label: '₦ Nigerian Naira' },
  { value: 'USD', label: '$ US Dollar' },
  { value: 'EUR', label: '€ Euro' },
  { value: 'GBP', label: '£ British Pound' },
];

const documentTypes = [
  'C of O',
  'Deed of Assignment',
  'Tenancy Agreement',
  'Photo of the Contact Banner',
  'Power of Attorney',
  'Others',
];

const amenities = [
  'Swimming Pool',
  'Security Gate',
  'Solar Power',
  'Borehole/Water Supply',
  'Generator',
  'Smart Home Features',
  'Balcony',
  'Gated Community',
  'Elevator',
  'Gym',
  'Jacuzzi',
  'CCTV Cameras',
  'Free WiFi',
  'Ocean View',
  'Parking Space',
  'Restaurants Nearby',
  'Mosques Nearby',
  'Church Nearby',
  'Supermarket Nearby',
  'School Nearby',
];

const PropertyForm: React.FC<PropertyFormProps> = ({ isEdit = false, initialData }) => {
  const router = useRouter();
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [propertyDocument, setPropertyDocument] = useState<File | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PropertyFormValues>({
    resolver: customResolver(PropertyFormSchema),
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImages = [...propertyImages, ...files];
      setPropertyImages(newImages);
      form.setValue('propertyImages', newImages);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPropertyDocument(file);
      form.setValue('propertyDocument', file);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = propertyImages.filter((_, i) => i !== index);
    setPropertyImages(newImages);
    form.setValue('propertyImages', newImages);
  };
  const handleImageReplace = (index: number) => {
    handleImageRemove(index);
    imageInputRef.current?.click();
  };

  const handleDocumentRemove = () => {
    setPropertyDocument(null);
    form.setValue('propertyDocument', undefined);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const handleDocumentReplace = () => {
    documentInputRef.current?.click();
  };

  const onSubmit = (data: PropertyFormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex w-full flex-col gap-4 bg-white px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-6 sm:gap-8 lg:gap-10">
            <Breadcrumb className="w-full overflow-hidden">
              <BreadcrumbList className="flex-wrap">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/properties" className="text-sm">
                      Properties
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash className="h-3 w-3" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate text-sm sm:max-w-none">
                    {initialData?.listingTitle || '456 Market Avenue, Ikeja, Lagos'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-lg font-semibold text-black sm:text-xl">
                {isEdit ? 'Edit Property Details' : 'New Property'}
              </h1>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.history.back()}
                  className="h-10 w-full rounded-[32px] bg-[#F1F1F4] px-8 py-[15px] text-[14px] font-semibold text-[#1F2130] sm:w-auto"
                >
                  Cancel
                </Button>

                <Button
                  style={{
                    background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  type="submit"
                  className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] px-8 py-4 text-[14px] font-semibold text-white sm:w-auto"
                >
                  {isEdit ? 'Update' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-5 rounded-[10px]">
            {/* Basic Information */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="listingTitle"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Listing Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="456 Market Avenue" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Listing Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="For Sale" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Short Let">Short Let</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Details */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Duplex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="landType"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Land Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Residential" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {landTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      House / Apartment No.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="456 Market Avenue" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetName"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Street Name</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Market Avenue" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">City</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Market Avenue" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Market Avenue" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
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
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Lagos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
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
                      Local Government
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Ikeja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localGovernments.map((lg) => (
                          <SelectItem key={lg} value={lg}>
                            {lg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Description */}
            <div className="w-full">
              <FormField
                control={form.control}
                name="propertyDescription"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="5  Bedroom fully detached house with 2 maid rooms, an elevator, rooftop terraces (front and back), a swimming pool, a cinema/movie theater, etc."
                        className="min-h-[80px] resize-none rounded-lg border-[#D5D5DD] sm:min-h-[64px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Property Specifications */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Bedrooms</FormLabel>
                    <FormControl>
                      <Input placeholder="5" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Bathroom</FormLabel>
                    <FormControl>
                      <Input placeholder="6" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalArea"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Total Area</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="800" className="h-10 rounded-lg border-[#D5D5DD] pr-12" {...field} />
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#71748C]">sq ft</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyPrice"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Price
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="56,000,000.00" className="h-10 rounded-lg border-[#D5D5DD]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="₦ Nigerian Naira" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Property Images */}
            <div className="flex w-full flex-col gap-3">
              <h3 className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                Property Images
              </h3>

              {propertyImages.length === 0 ? (
                <div className="w-full">
                  <div
                    className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-8 text-center transition-colors hover:border-[#D4AF36] sm:py-6"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[14px] leading-[17px] text-[#71748C]">
                        <span className="cursor-pointer font-semibold text-[#B69118]">Click </span> to upload
                      </p>
                      <p className="text-[10px] leading-[12px] text-[#71748C]">Supports JPEG, or PNG files.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {propertyImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative flex w-full items-center justify-center self-stretch rounded-[6px] bg-[#E3E3E8] py-3"
                      onMouseEnter={() => setHoveredImage(index)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <div className="h-[120px] w-full bg-transparent sm:h-[108px]">
                        <img
                          width={279}
                          height={108}
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div
                        className={cn(
                          'absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0_/_20%)] backdrop-blur-[2px] transition-all duration-300',
                          hoveredImage === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-4 py-2 text-[12px] leading-[14px] font-normal text-black sm:px-6"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash className="size-[14px] text-[#D20832]" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-4 py-2 text-[12px] leading-[14px] font-normal text-black sm:px-6"
                            onClick={() => handleImageReplace(index)}
                          >
                            <RotateCcw className="size-[14px]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div
                    className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-8 text-center transition-colors hover:border-[#D4AF36] sm:py-6"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[14px] leading-[17px] text-[#71748C]">
                        <span className="cursor-pointer font-semibold text-[#B69118]">Click </span> to upload
                      </p>
                      <p className="text-[10px] leading-[12px] text-[#71748C]">Supports JPEG, or PNG files.</p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Property Document */}
            <div className="flex w-full flex-col gap-3">
              <h3 className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                Property Document
              </h3>

              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1.5">
                      <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                        Document Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                    Supports JPEG, or PNG files.
                  </label>

                  {!propertyDocument ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full px-4 sm:w-fit"
                      onClick={() => documentInputRef.current?.click()}
                    >
                      <Upload className="mr-2 size-4" />
                      Choose file
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-[#E3E3E8] p-3">
                      <span className="flex-1 truncate text-sm text-[#1F2130]">{propertyDocument.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={handleDocumentReplace}
                        >
                          <RotateCcw className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-600"
                          onClick={handleDocumentRemove}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Nearby Amenities */}
            <FormField
              control={form.control}
              name="nearbyAmenities"
              render={() => (
                <FormItem className="w-full gap-1.5">
                  <FormLabel className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                    Features
                  </FormLabel>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {amenities.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="nearbyAmenities"
                        render={({ field }) => {
                          return (
                            <FormItem key={amenity} className="flex flex-row items-start space-y-0 space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, amenity])
                                      : field.onChange(field.value?.filter((value) => value !== amenity));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm leading-5 font-normal">{amenity}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
