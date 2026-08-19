import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  cn,
  formatNumberWithCommas,
  parseNumber,
  getUploadErrorMessage,
  checkFileSizeLimit,
} from "@/lib/utils";
import { Upload, RotateCcw, Trash, X, Slash, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { z } from "zod/v4";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useForm } from "react-hook-form";
import { customResolver } from "@/lib/customZodResolver";
import { Link, useRouter } from "@tanstack/react-router";
import {
  useCreateProperty,
  useUpdateProperty,
  useUploadPropertyImage,
  useUploadPropertyDocument,
  useUploadProofOfAddress,
  useDeletePropertyImage,
} from "@/lib/services/properties";
import { toast } from "@/lib/toast";
import { Separator } from "@/components/ui/separator";
import statesAndLgasData from "@/data/statesAndLocalGov.json";
import { useGetProfileData } from "@/lib/services/profile";
import { listingTypes, propertyFeatures, propertyStatus, propertyTypes } from "@/data/reuseable";

const numberField = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;

    if (typeof val === "string") {
      const parsed = Number(val.replaceAll(",", ""));
      return Number.isNaN(parsed) ? val : parsed;
    }

    return val;
  },
  z
    .number({
      error: "This field must be a number.",
    })
    .int()
    .min(0, "This field cannot be negative") // 👈 allow 0
    .optional(),
);
// Zod Schema
const PropertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Listing title is required"),
  category_slug: z.enum(["for-rent", "for-sale", "short-let", "joint-venture"], {
    error: "Please select a listing type",
  }),
  property_type: z.string().min(1, "Property type is required"),
  sub_type: z.string().optional(),
  address: z.string().min(1, "House/Apartment number is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  lga_or_city: z.string().min(1, "Locality is required"),
  area: z.string().optional(),
  description: z.string().min(10, "Property description must be at least 10 characters"),

  bedrooms: numberField,
  bathrooms: numberField,
  area_sqft: numberField,

  price: numberField,
  currency: z.string().min(1, "Currency is required"),
  images: z.array(z.string()).min(1, "At least one property image is required"),
  documentType: z.string().optional(),
  propertyDocument: z.string().optional(),
  proofOfAddress: z.string().optional(),
  features: z.array(z.string()).default([]),
  status: z.array(z.string()).default([]),
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

interface PropertyFormProps {
  isEdit?: boolean;
  initialData?: Partial<PropertyFormValues>;
}

interface FileState {
  file: File;
  preview: string;
  status: "idle" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

interface DocumentState extends FileState {
  type?: string;
}

const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_COMPRESSION_QUALITY = 0.8;

const currencies = [
  { value: "NGN", label: "₦ Nigerian Naira" },
  { value: "USD", label: "$ US Dollar" },
  { value: "EUR", label: "€ Euro" },
  { value: "GBP", label: "£ British Pound" },
];

const documentTypes = [
  "C of O",
  "Deed of Assignment",
  "Tenancy Agreement",
  "Power of Attorney",
  "Others",
];

const createExistingFileState = (url?: string): DocumentState | null => {
  if (!url) return null;

  const filename = url.split("/").pop() || "existing-file";

  return {
    file: new File([], filename),
    preview: url,
    status: "success",
    url,
  };
};

const PropertyForm: React.FC<PropertyFormProps> = ({ isEdit = false, initialData }) => {
  const router = useRouter();

  const { data: user } = useGetProfileData();
  const [propertyImages, setPropertyImages] = useState<FileState[]>(
    initialData?.images?.map((url) => ({
      file: new File([], ""),
      preview: url,
      status: "success",
      url,
    })) || [],
  );
  const [propertyDocument, setPropertyDocument] = useState<DocumentState | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<DocumentState | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [imageReplaceIndex, setImageReplaceIndex] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const proofOfAddressInputRef = useRef<HTMLInputElement>(null);
  const [selectedState, setSelectedState] = useState(initialData?.state || "");
  const [selectedLga, setSelectedLga] = useState(initialData?.lga_or_city || "");

  const { mutateAsync: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutateAsync: updateProperty, isPending: isUpdating } = useUpdateProperty(
    initialData?.id || "",
  );
  const { mutateAsync: uploadImage } = useUploadPropertyImage();
  const { mutateAsync: uploadPropertyDoc } = useUploadPropertyDocument();
  const { mutateAsync: uploadDocument } = useUploadProofOfAddress();
  const { mutateAsync: deletePropertyImage } = useDeletePropertyImage();

  const isPending = isCreating || isUpdating;

  const lgas = useMemo(() => {
    if (!selectedState) {
      return [];
    }
    const stateData = statesAndLgasData.find((s) => s.state === selectedState);
    return stateData ? stateData.lgas : [];
  }, [selectedState]);

  const areas = useMemo(() => {
    if (!selectedLga) {
      return [];
    }
    const stateData = statesAndLgasData.find((s) => s.state === selectedState);

    return stateData && selectedLga in stateData
      ? (stateData[selectedLga as keyof typeof stateData] as string[])
      : [];
  }, [selectedLga, selectedState]);

  const form = useForm<PropertyFormValues>({
    resolver: customResolver(PropertyFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? "",
      category_slug: initialData?.category_slug ?? "for-rent",
      property_type: initialData?.property_type ?? "",
      sub_type: initialData?.sub_type ?? "",
      address: initialData?.address ?? "",
      country: initialData?.country ?? "Nigeria",
      state: initialData?.state ?? "",
      lga_or_city: initialData?.lga_or_city ?? "",
      area: initialData?.area ?? "",
      description: initialData?.description ?? "",
      bedrooms: initialData?.bedrooms ?? 0,
      bathrooms: initialData?.bathrooms ?? 0,
      area_sqft: initialData?.area_sqft ?? 0,
      price: initialData?.price ?? 0,
      currency: initialData?.currency ?? "NGN",
      images: initialData?.images ?? [],
      documentType: initialData?.documentType ?? "",
      propertyDocument: initialData?.propertyDocument ?? "",
      proofOfAddress: initialData?.proofOfAddress ?? "",
      features: initialData?.features ?? [],
      status: initialData?.status ?? [],
    },
  });

  const propertyType = form.watch("property_type");

  const subTypes = useMemo(() => {
    if (!propertyType) {
      return [];
    }
    const selectedType = propertyTypes.find((p) => p.types === propertyType);
    return selectedType ? selectedType.sub_types : [];
  }, [propertyType]);

  const optimizeImageBeforeUpload = (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
      return Promise.resolve(file);
    }

    return new Promise((resolve) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        const { width, height } = image;
        const largestSide = Math.max(width, height);
        const scale = largestSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / largestSide : 1;
        const targetWidth = Math.round(width * scale);
        const targetHeight = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext("2d");
        if (!context) {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
          return;
        }

        context.drawImage(image, 0, 0, targetWidth, targetHeight);

        const outputType =
          file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const optimized = new File([blob], file.name, {
              type: blob.type || outputType,
              lastModified: Date.now(),
            });
            resolve(optimized);
          },
          outputType,
          IMAGE_COMPRESSION_QUALITY,
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      image.src = objectUrl;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const isReplacingImage = imageReplaceIndex !== null;
    const maxAllowedImages = isReplacingImage
      ? propertyImages.length
      : propertyImages.length + files.length;

    if (!isReplacingImage && propertyImages.length + files.length > 15) {
      toast.error("You can upload a maximum of 15 images.");
      event.target.value = "";
      return;
    }

    if (files.length === 0) {
      event.target.value = "";
      return;
    }

    const uploadFiles = isReplacingImage ? files.slice(0, 1) : files;
    const optimizedFiles = await Promise.all(
      uploadFiles.map((file) => optimizeImageBeforeUpload(file)),
    );
    const newImageStates: FileState[] = optimizedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
    }));

    if (isReplacingImage) {
      const replacementIndex = imageReplaceIndex;
      const imageBeingReplaced =
        replacementIndex !== null ? propertyImages[replacementIndex] : null;

      if (replacementIndex === null || !imageBeingReplaced) {
        setImageReplaceIndex(null);
        event.target.value = "";
        return;
      }

      setPropertyImages((prev) =>
        prev.map((img, index) => (index === replacementIndex ? newImageStates[0] : img)),
      );

      try {
        const formData = new FormData();
        formData.append("property_images_data", newImageStates[0].file);
        formData.append("image_number", String(replacementIndex + 1));
        const response = await uploadImage(formData);

        if (imageBeingReplaced.url) {
          try {
            await deletePropertyImage(imageBeingReplaced.url);
          } catch {
            toast.error("Image replaced, but the previous file could not be deleted.");
          }
        }

        setPropertyImages((prev) =>
          prev.map((img, index) =>
            index === replacementIndex
              ? {
                  ...newImageStates[0],
                  status: "success",
                  url: response.data.data.image_url,
                }
              : img,
          ),
        );
      } catch (error) {
        const message = getUploadErrorMessage(error, "Failed to replace image.");
        toast.error(message);
        setPropertyImages((prev) =>
          prev.map((img, index) =>
            index === replacementIndex
              ? { ...newImageStates[0], status: "error", error: message }
              : img,
          ),
        );
      } finally {
        setImageReplaceIndex(null);
        event.target.value = "";
      }

      return;
    }

    if (maxAllowedImages > 15) {
      toast.error("You can upload a maximum of 15 images.");
      event.target.value = "";
      return;
    }

    setPropertyImages((prev) => [...prev, ...newImageStates]);

    const uploadPromises = newImageStates.map((imageState, index) => {
      const formData = new FormData();
      formData.append("property_images_data", imageState.file);
      formData.append("image_number", String(propertyImages.length + index + 1));
      return uploadImage(formData).then((response) => ({
        ...imageState,
        status: "success" as const,
        url: response.data.data.image_url,
      }));
    });

    Promise.all(uploadPromises)
      .then((results) => {
        setPropertyImages((prev) =>
          prev.map((img) => {
            const successUpload = results.find((r) => r.preview === img.preview);
            return successUpload || img;
          }),
        );
      })
      .catch((error) => {
        const message = getUploadErrorMessage(error, "Some images failed to upload.");
        toast.error(message);
        setPropertyImages((prev) =>
          prev.map((img) =>
            newImageStates.some((s) => s.preview === img.preview)
              ? { ...img, status: "error", error: message }
              : img,
          ),
        );
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const sizeError = checkFileSizeLimit(file, 10);
      if (sizeError) {
        toast.error(sizeError);
        event.target.value = "";
        return;
      }

      const docState: DocumentState = {
        file,
        preview: URL.createObjectURL(file),
        status: "uploading",
      };
      setPropertyDocument(docState);

      const formData = new FormData();
      formData.append("property_document", file);

      uploadPropertyDoc(formData)
        .then((response) => {
          setPropertyDocument((prev) =>
            prev ? { ...prev, status: "success", url: response.data.data.image_url } : null,
          );
        })
        .catch((error) => {
          const message = getUploadErrorMessage(error, "Failed to upload document.");
          setPropertyDocument((prev) => (prev ? { ...prev, status: "error", error: message } : null));
          toast.error(message);
        });
    }
  };

  const handleProofOfAddressUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const sizeError = checkFileSizeLimit(file, 10);
      if (sizeError) {
        toast.error(sizeError);
        event.target.value = "";
        return;
      }

      const docState: DocumentState = {
        file,
        preview: URL.createObjectURL(file),
        status: "uploading",
      };
      setProofOfAddress(docState);

      const formData = new FormData();
      formData.append("prove_of_address_document", file);

      uploadDocument(formData)
        .then((response) => {
          setProofOfAddress((prev) =>
            prev ? { ...prev, status: "success", url: response.data.data.image_url } : null,
          );
        })
        .catch((error) => {
          const message = getUploadErrorMessage(error, "Failed to upload proof of address.");
          setProofOfAddress((prev) => (prev ? { ...prev, status: "error", error: message } : null));
          toast.error(message);
        });
    }
  };

  useEffect(() => {
    const uploadedImageUrls = propertyImages
      .filter((img) => img.status === "success" && img.url)
      .map((img) => img.url!);
    form.setValue("images", uploadedImageUrls);
  }, [propertyImages, form]);

  useEffect(() => {
    if (propertyDocument?.status === "success" && propertyDocument.url) {
      form.setValue("propertyDocument", propertyDocument.url);
    }
  }, [propertyDocument, form]);

  useEffect(() => {
    if (proofOfAddress?.status === "success" && proofOfAddress.url) {
      form.setValue("proofOfAddress", proofOfAddress.url);
    }
  }, [proofOfAddress, form]);

  useEffect(() => {
    setPropertyDocument(createExistingFileState(initialData?.propertyDocument));
    setProofOfAddress(createExistingFileState(initialData?.proofOfAddress));
  }, [initialData?.propertyDocument, initialData?.proofOfAddress]);

  const handleImageRemove = async (index: number) => {
    const imageToRemove = propertyImages[index];

    // Only attempt to delete if the image has a URL (i.e., it's saved on the server)
    if (imageToRemove.url) {
      try {
        // Extract the filename from the URL

        // Call the delete mutation
        await deletePropertyImage(imageToRemove.url);

        // If deletion is successful, then remove from local state
        const newImages = propertyImages.filter((_, i) => i !== index);
        setPropertyImages(newImages);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to delete image.");
      }
    } else {
      // If there's no URL, it's a new image that hasn't been uploaded yet.
      // Just remove it from the local state.
      const newImages = propertyImages.filter((_, i) => i !== index);
      setPropertyImages(newImages);
    }
  };
  const handleImageReplace = (index: number) => {
    setImageReplaceIndex(index);
    imageInputRef.current?.click();
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= propertyImages.length ||
      toIndex >= propertyImages.length
    ) {
      return;
    }

    setPropertyImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDocumentRemove = () => {
    setPropertyDocument(null);
    form.setValue("propertyDocument", "");
    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const handleDocumentReplace = () => {
    handleDocumentRemove();
    documentInputRef.current?.click();
  };

  const handleProofOfAddressRemove = () => {
    setProofOfAddress(null);
    form.setValue("proofOfAddress", "");
    if (proofOfAddressInputRef.current) {
      proofOfAddressInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    // Find the correct casing for property_type
    const correctPropertyType = propertyTypes.find(
      (p) => p.types.toLowerCase() === data.property_type.toLowerCase(),
    );

    const payload = {
      ...data,
      property_type: correctPropertyType ? correctPropertyType.types : data.property_type,
      price: Number(data.price),
    };

    try {
      if (isEdit) {
        await updateProperty(payload);
        toast.success("Property updated successfully!");
      } else {
        await createProperty(payload);
        toast.success("Property created successfully!");
      }
      router.navigate({ to: "/properties" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
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
                  <Slash className="size-3" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate text-sm sm:max-w-none">
                    {initialData?.title ?? ""}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex w-full flex-col gap-4">
              <h1 className="text-lg font-semibold text-black sm:text-xl">
                {isEdit ? "Edit Property Details" : "New Property"}
              </h1>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-5 rounded-[10px]">
            {/* Basic Information */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Listing Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Luxury Beachfront Apartment"
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
                name="category_slug"
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
                        {listingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
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
                name="property_type"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Type
                    </FormLabel>
                    {isEdit ? (
                      <div className="flex h-10 items-center rounded-lg border border-[#D5D5DD] bg-[#F9F9FB] px-3 text-sm text-[#1F2130]">
                        {form.getValues().property_type || initialData?.property_type || "—"}
                      </div>
                    ) : (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("sub_type", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                            <SelectValue placeholder="Select Property Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.types} value={type.types}>
                              {type.types}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sub_type"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Sub-Type
                    </FormLabel>
                    {isEdit ? (
                      <div className="flex h-10 items-center rounded-lg border border-[#D5D5DD] bg-[#F9F9FB] px-3 text-sm text-[#1F2130]">
                        {form.getValues().sub_type || initialData?.sub_type || "—"}
                      </div>
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={subTypes.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                            <SelectValue placeholder="Select Property Sub-Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="45, Market Avenue"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      State
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedState(value);
                        form.setValue("lga_or_city", "");
                        form.setValue("area", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select State" />
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
                name="lga_or_city"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Locality
                    </FormLabel>
                    <Select
                      disabled={!selectedState || lgas.length === 0}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedLga(value);
                        form.setValue("area", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                          <SelectValue placeholder="Select Locality" />
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
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Area (Optional)
                    </FormLabel>
                    <Select
                      disabled={!selectedLga || areas.length === 0}
                      onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}
                      value={field.value || "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD] bg-white">
                          <SelectValue
                            placeholder={selectedLga ? "Select area" : "Select locality first"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="__none__">None</SelectItem>
                        {areas.map((area, index) => (
                          <SelectItem key={`${area}${index}`} value={area}>
                            {area}
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
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="5  Bedroom fully detached house with 2 maid rooms, an elevator, rooftop terraces (front and back), a swimming pool, a cinema/movie theater, etc."
                        className="min-h-40 resize-none rounded-lg border-[#D5D5DD] sm:min-h-16"
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
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                        value={formatNumberWithCommas(field.value?.toString() || "")}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          field.onChange(raw); // store raw number
                        }}
                      />
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
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Bathroom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="6"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                        value={formatNumberWithCommas(field.value?.toString() || "")}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          field.onChange(raw); // store raw number
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_sqft"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Total Area
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="800"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-12"
                          {...field}
                          value={formatNumberWithCommas(field.value?.toString() || "")}
                          onChange={(e) => {
                            const raw = parseNumber(e.target.value);
                            field.onChange(raw); // store raw number
                          }}
                        />
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#71748C]">
                          sq m
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Property Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="56,000,000.00"
                        className="h-10 rounded-lg border-[#D5D5DD]"
                        {...field}
                        value={formatNumberWithCommas(field.value?.toString() || "")}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          field.onChange(raw); // store raw number
                        }}
                      />
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
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Currency
                    </FormLabel>
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
                        <span className="cursor-pointer font-semibold text-[#B69118]">Click </span>{" "}
                        to upload
                      </p>
                      <p className="text-[10px]/3 text-[#71748C]">
                        Supports JPEG or PNG files, up to 15 MB.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {propertyImages.map((image, index) => (
                    <div
                      key={`${image.preview}-${index}`}
                      className="relative flex w-full items-center justify-center self-stretch rounded-[6px] bg-[#E3E3E8] py-3"
                      onMouseEnter={() => setHoveredImage(index)}
                      onMouseLeave={() => setHoveredImage(null)}
                      draggable
                      onDragStart={() => setDraggedImageIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedImageIndex === null) return;
                        moveImage(draggedImageIndex, index);
                        setDraggedImageIndex(null);
                      }}
                      onDragEnd={() => setDraggedImageIndex(null)}
                    >
                      <div className="relative h-[120px] w-full bg-transparent sm:h-[108px]">
                        <img
                          src={image.preview}
                          alt={`Property ${index + 1}`}
                          className="size-full object-cover"
                        />
                        {image.status === "uploading" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="size-6 animate-spin text-white" />
                          </div>
                        )}
                        {image.status === "error" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/70 text-white">
                            <X className="size-6" />
                            <span className="text-xs">Failed</span>
                          </div>
                        )}
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 z-10 flex size-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0/20%)] backdrop-blur-[2px] transition-all duration-300",
                          hoveredImage === index ? "opacity-100" : "pointer-events-none opacity-0",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-3 py-2 text-[12px]/3.5 font-normal text-black"
                            onClick={() => moveImage(index, index - 1)}
                            disabled={index === 0}
                          >
                            <ArrowLeft className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-3 py-2 text-[12px]/3.5 font-normal text-black"
                            onClick={() => moveImage(index, index + 1)}
                            disabled={index === propertyImages.length - 1}
                          >
                            <ArrowRight className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-4 py-2 text-[12px]/3.5 font-normal text-black sm:px-6"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash className="size-3.5 text-[#D20832]" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-4 py-2 text-[12px]/3.5 font-normal text-black sm:px-6"
                            onClick={() => handleImageReplace(index)}
                          >
                            <RotateCcw className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {propertyImages.length < 15 && (
                    <div
                      className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-8 text-center transition-colors hover:border-[#D4AF36] sm:py-6"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-[14px] leading-[17px] text-[#71748C]">
                          <span className="cursor-pointer font-semibold text-[#B69118]">
                            Click{" "}
                          </span>{" "}
                          to upload
                        </p>
                        <p className="text-[10px]/3 text-[#71748C]">
                        Supports JPEG or PNG files, up to 15 MB.
                      </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple={imageReplaceIndex === null}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {user?.user_role === "owner" && (
              <>
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
                        Supports JPEG, PNG, PDF or DOCX files, up to 10 MB.
                      </label>

                      {propertyDocument?.status === "uploading" ? (
                        <div className="flex h-10 items-center justify-center rounded-lg border border-dashed">
                          <Loader2 className="size-5 animate-spin text-gray-500" />
                        </div>
                      ) : !propertyDocument ? (
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
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-lg border p-3",
                            propertyDocument.status === "error"
                              ? "border-red-500"
                              : "border-[#E3E3E8]",
                          )}
                        >
                          <span className="flex-1 truncate text-sm text-[#1F2130]">
                            {propertyDocument.file.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="size-6 p-0"
                              onClick={handleDocumentReplace}
                            >
                              <RotateCcw className="size-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="size-6 p-0 text-red-600"
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
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="h-px w-full bg-[#EEEEF1]" />

                {/* Proof of Address */}
                <div className="flex w-full flex-col gap-3">
                  <h3 className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                    Proof of Address
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Upload a utility bill or other document as proof of address.
                    </label>
                    <p className="text-[10px]/3 text-[#71748C]">
                      Supports JPEG, PNG, PDF or DOCX files, up to 10 MB.
                    </p>

                    {proofOfAddress?.status === "uploading" ? (
                      <div className="flex h-10 items-center justify-center rounded-lg border border-dashed">
                        <Loader2 className="size-5 animate-spin text-gray-500" />
                      </div>
                    ) : !proofOfAddress ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full px-4 sm:w-fit"
                        onClick={() => proofOfAddressInputRef.current?.click()}
                      >
                        <Upload className="mr-2 size-4" />
                        Choose file
                      </Button>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3",
                          proofOfAddress.status === "error" ? "border-red-500" : "border-[#E3E3E8]",
                        )}
                      >
                        <span className="flex-1 truncate text-sm text-[#1F2130]">
                          {proofOfAddress.file.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="size-6 p-0"
                            onClick={() => proofOfAddressInputRef.current?.click()}
                          >
                            <RotateCcw className="size-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="size-6 p-0 text-red-600"
                            onClick={handleProofOfAddressRemove}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <input
                      ref={proofOfAddressInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={handleProofOfAddressUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </>
            )}

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem className="w-full gap-1.5">
                  <FormLabel className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                    Status
                  </FormLabel>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {propertyStatus
                      .filter((status) => status !== "New")
                      .map((status) => (
                        <FormField
                          key={status}
                          control={form.control}
                          name="status"
                          render={({ field }) => {
                            const value = field.value ?? [];
                            return (
                              <FormItem
                                key={status}
                                className="flex flex-row items-start space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={value.includes(status)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...value, status])
                                        : field.onChange(value.filter((v) => v !== status));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm/5 font-normal">{status}</FormLabel>
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

            <Separator className="h-px w-full bg-[#EEEEF1]" />

            {/* Features */}
            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem className="w-full gap-1.5">
                  <FormLabel className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] capitalize">
                    Features
                  </FormLabel>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {propertyFeatures.map((feature) => (
                      <FormField
                        key={feature}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          const value = field.value ?? [];
                          return (
                            <FormItem
                              key={feature}
                              className="flex flex-row items-start space-y-0 space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={value.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...value, feature])
                                      : field.onChange(value.filter((v) => v !== feature));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm/5 font-normal">{feature}</FormLabel>
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

            {/* Global Form Errors */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="w-full rounded-lg border border-red-300 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <div className="shrink-0">
                    <X className="size-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
                      {Object.entries(form.formState.errors).map(([field, error]) => (
                        <li key={field}>
                          <span className="font-medium">{field}:</span> {error?.message as string}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - moved to bottom */}
            <div className="flex w-full flex-col gap-4 pt-6 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.history.back()}
                className="h-12 w-full rounded-4xl bg-[#F1F1F4] px-6 py-3 text-[14px] font-semibold text-[#1F2130] sm:w-auto sm:flex-1"
              >
                Cancel
              </Button>

              <Button
                style={{
                  background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                type="submit"
                className="h-12 w-full rounded-[40px] px-6 py-3 text-[14px] font-semibold text-white sm:w-auto sm:flex-1"
              >
                {isPending
                  ? isEdit
                    ? "Updating..."
                    : "Submitting..."
                  : isEdit
                    ? "Update"
                    : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
