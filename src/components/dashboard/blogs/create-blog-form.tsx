import React from "react";

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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slash, Trash, RotateCcw, CircleX } from "lucide-react";
import { useState, useRef } from "react";
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

import { Separator } from "@/components/ui/separator";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote, LinkIcon, ImageIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { customResolver } from "@/lib/customZodResolver";

// Zod Schema for Blog Form
const BlogFormSchema = z.object({
  listingTitle: z.string().min(1, "Listing title is required"),
  headerImage: z.instanceof(File).optional(),
  bodyText: z.string().min(10, "Body text must be at least 10 characters"),
  seoTitle: z.array(z.string()).default([]),
  focusKeyphrase: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  blogCategory: z.string().min(1, "Blog category is required"),
  customTags: z.array(z.string()).default([]),
});

export type BlogFormValues = z.infer<typeof BlogFormSchema>;

interface BlogFormProps {
  isEdit?: boolean;
  initialData?: Partial<BlogFormValues>;
}

const blogCategories = [
  "Market Trends",
  "Investment Tips",
  "Property News",
  "Real Estate Guide",
  "Legal Advice",
  "Technology",
  "Lifestyle",
];

const CreateBlogForm: React.FC<BlogFormProps> = ({ isEdit = false, initialData }) => {
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [seoTitleInput, setSeoTitleInput] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BlogFormValues>({
    resolver: customResolver(BlogFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      seoTitle: [],
      customTags: [],
      ...initialData,
    },
  });

  // Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.bodyText || "",
    onUpdate: ({ editor }) => {
      form.setValue("bodyText", editor.getHTML());
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeaderImage(file);
      form.setValue("headerImage", file);
    }
  };

  const handleImageRemove = () => {
    setHeaderImage(null);
    form.setValue("headerImage", undefined);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageReplace = () => {
    imageInputRef.current?.click();
  };

  const addSeoTag = () => {
    if (seoTitleInput.trim()) {
      const currentTags = form.getValues("seoTitle");
      form.setValue("seoTitle", [...currentTags, seoTitleInput.trim()]);
      setSeoTitleInput("");
    }
  };

  const removeSeoTag = (index: number) => {
    const currentTags = form.getValues("seoTitle");
    form.setValue(
      "seoTitle",
      currentTags.filter((_, i) => i !== index),
    );
  };

  const addCustomTag = () => {
    if (customTagInput.trim()) {
      const currentTags = form.getValues("customTags");
      form.setValue("customTags", [...currentTags, customTagInput.trim()]);
      setCustomTagInput("");
    }
  };

  const removeCustomTag = (index: number) => {
    const currentTags = form.getValues("customTags");
    form.setValue(
      "customTags",
      currentTags.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: BlogFormValues) => {
    console.log(data);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Watch title changes to auto-generate slug
  const watchedTitle = form.watch("listingTitle");
  React.useEffect(() => {
    if (watchedTitle && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(watchedTitle));
    }
  }, [watchedTitle, form]);

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex w-full flex-col gap-4 bg-white py-8">
            {/* Header */}
            <div className="flex w-full flex-col items-start gap-10">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/blogs">Blogs</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {initialData?.listingTitle || "How to position your team for success"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex w-full items-center justify-between gap-10 self-stretch">
                <h1 className="text-[20px]/6 font-semibold text-black">
                  {isEdit ? "Edit Post" : "New Post"}
                </h1>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 self-stretch rounded-4xl bg-[#F1F1F4] px-8 py-[15px] text-[14px] leading-[17px] font-semibold text-[#1F2130]"
                  >
                    Save Draft
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePreview}
                    className="h-8 self-stretch rounded-4xl bg-[#F1F1F4] px-8 py-[15px] text-[14px] leading-[17px] font-semibold text-[#1F2130]"
                  >
                    Preview
                  </Button>

                  <Button
                    style={{
                      background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                      boxShadow:
                        "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                    }}
                    className="h-8 rounded-[40px] border border-[oklch(0.235_0_0/50%)] px-6 text-[14px] leading-[17px] font-semibold text-white"
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="col-span-2 flex flex-col gap-5">
                {/* Listing Title */}
                <FormField
                  control={form.control}
                  name="listingTitle"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1.5">
                      <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                        Listing Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How to position your team for success"
                          className="h-10 rounded-lg border-[#D5D5DD]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Header Image */}
                <div className="flex w-full flex-col gap-3">
                  <h3 className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                    Header Image
                  </h3>

                  {!headerImage ? (
                    <div
                      className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-6 text-center transition-colors hover:border-[#D4AF36]"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-[14px] leading-[17px] text-[#71748C]">
                          Drag and drop here or{" "}
                          <span className="cursor-pointer font-semibold text-[#B69118]">
                            click to upload
                          </span>
                        </p>
                        <p className="text-[10px]/3 text-[#71748C]">
                          Supports PDF, JPEG, or PNG files. Smaller than 1 MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative flex w-full items-center justify-center self-stretch rounded-[6px] bg-[#E3E3E8] py-3"
                      onMouseEnter={() => setHoveredDocument("headerImage")}
                      onMouseLeave={() => setHoveredDocument(null)}
                    >
                      <div className="h-48 w-[250px] bg-transparent">
                        <img
                          src={URL.createObjectURL(headerImage)}
                          alt=""
                          className="size-full object-contain"
                          width={250}
                          height={192}
                        />
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 z-10 flex size-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0/20%)] backdrop-blur-[2px] transition-all duration-300",
                          hoveredDocument === "headerImage"
                            ? "opacity-100"
                            : "pointer-events-none opacity-0",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                            onClick={handleImageRemove}
                          >
                            <Trash className="size-3.5 text-[#D20832]" />
                            Remove
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                            onClick={handleImageReplace}
                          >
                            <RotateCcw className="size-3.5" />
                            Replace
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Body Text Editor */}
                <div className="flex w-full flex-col gap-3">
                  <h3 className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                    Body Text
                  </h3>

                  <div className="flex w-full flex-col gap-0">
                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-[#D5D5DD] bg-[#F8F9FA] p-2">
                      <Select defaultValue="heading2">
                        <SelectTrigger className="h-8 w-32 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                          <SelectItem value="heading1">Heading 1</SelectItem>
                          <SelectItem value="heading2">Heading 2</SelectItem>
                          <SelectItem value="heading3">Heading 3</SelectItem>
                        </SelectContent>
                      </Select>

                      <Separator orientation="vertical" className="h-6" />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                      >
                        <Bold className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                      >
                        <Italic className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      >
                        <List className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      >
                        <ListOrdered className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      >
                        <Quote className="size-4" />
                      </Button>

                      <Button type="button" variant="ghost" size="sm" className="size-8 p-0">
                        <LinkIcon className="size-4" />
                      </Button>

                      <Button type="button" variant="ghost" size="sm" className="size-8 p-0">
                        <ImageIcon className="size-4" />
                      </Button>
                    </div>

                    {/* Editor Content */}
                    <div className="min-h-[200px] rounded-b-lg border border-[#D5D5DD] p-4">
                      <EditorContent
                        editor={editor}
                        className="prose prose-sm max-w-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Category and Custom Tags */}
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="blogCategory"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Blog Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 w-full rounded-lg border-[#D5D5DD]">
                              <SelectValue placeholder="Market Trends" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {blogCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Custom Tags
                    </label>
                    <div className="relative">
                      <div className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-lg border border-[#D5D5DD] bg-white px-3">
                        {form.watch("customTags").map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 bg-[#F1F1F4] text-[#41415A]"
                          >
                            {tag}
                            <button type="button" onClick={() => removeCustomTag(index)}>
                              <CircleX className="size-4 cursor-pointer fill-[#9A9DAD] text-[#F1F1F4]" />
                            </button>
                          </Badge>
                        ))}
                        <Input
                          placeholder={form.watch("customTags").length === 0 ? "Add tag" : ""}
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomTag();
                            }
                          }}
                          className="flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - SEO Configuration */}
              <div className="flex flex-col gap-5 border-l border-[#F1F1F4] pl-6">
                <h2 className="text-[16px] leading-[19px] font-semibold text-[#41415A]">
                  SEO Configuration
                </h2>

                {/* SEO Title */}
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                    SEO Title
                  </label>
                  <div className="relative">
                    <div className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-lg border border-[#D5D5DD] bg-white px-3">
                      {form.watch("seoTitle").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 bg-[#F1F1F4] text-[#41415A]"
                        >
                          {tag}
                          <button type="button" onClick={() => removeSeoTag(index)}>
                            <CircleX className="size-4 cursor-pointer fill-[#9A9DAD] text-[#F1F1F4]" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        placeholder={form.watch("seoTitle").length === 0 ? "Add SEO title" : ""}
                        value={seoTitleInput}
                        onChange={(e) => setSeoTitleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSeoTag();
                          }
                        }}
                        className="flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Focus Keyphrase */}
                <FormField
                  control={form.control}
                  name="focusKeyphrase"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1.5">
                      <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                        Focus Keyphrase
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Luxury apartments in Lekki"
                          className="h-10 rounded-lg border-[#D5D5DD]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1.5">
                      <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                        Slug
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="3-bedroom-apartments-lekki"
                          className="h-10 rounded-lg border-[#D5D5DD]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1.5">
                      <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explore spacious 3-bedroom apartments in Lekki with modern amenities. Contact now for a viewing."
                          className="min-h-20 resize-none rounded-lg border-[#D5D5DD]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{form.watch("blogCategory") || "Market Trends"}</span>
                <span>•</span>
                <span>Sunday, February 12, 2023</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <DialogTitle>
              {form.watch("listingTitle") || "How to position your team for success"}
            </DialogTitle>

            {headerImage && (
              <div className="w-full">
                <img
                  src={URL.createObjectURL(headerImage) || "/placeholder.svg"}
                  alt="Header"
                  className="h-64 w-full rounded-lg object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateBlogForm;
