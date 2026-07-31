import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, RotateCcw, Trash } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface KYCDocumentsProps {
  form: UseFormReturn<any>;
  isOwner?: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const validateFile = (file: File): string | null => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a PDF, JPEG, or PNG file.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Please upload a file smaller than 1 MB.";
  }
  return null;
};

/** Creates an object URL for image previews and revokes it on file change/unmount. */
const useFilePreviewUrl = (file: File | null) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};

const KYCDocuments: React.FC<KYCDocumentsProps> = ({ form, isOwner = false }) => {
  const [cacDocument, setCacDocument] = useState<File | null>(null);
  const [govtId, setGovtId] = useState<File | null>(null);
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);

  const cacPreviewUrl = useFilePreviewUrl(cacDocument);
  const govtIdPreviewUrl = useFilePreviewUrl(govtId);

  const cacInputRef = useRef<HTMLInputElement>(null);
  const govtIdInputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (
    file: File | undefined,
    setFile: (file: File) => void,
    formField: string,
  ) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setFile(file);
    form.setValue(formField, file);
  };

  const handleCacUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0], setCacDocument, "cacDocument");
  };

  const handleGovtIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0], setGovtId, "govtIssuedId");
  };

  const handleCacRemove = () => {
    setCacDocument(null);
    form.setValue("cacDocument", null);
    if (cacInputRef.current) {
      cacInputRef.current.value = "";
    }
  };

  const handleGovtIdRemove = () => {
    setGovtId(null);
    form.setValue("govtIssuedId", null);
    if (govtIdInputRef.current) {
      govtIdInputRef.current.value = "";
    }
  };

  const handleCacReplace = () => {
    cacInputRef.current?.click();
  };

  const handleGovtIdReplace = () => {
    govtIdInputRef.current?.click();
  };

  const makeDropHandlers = (
    zone: string,
    setFile: (file: File) => void,
    formField: string,
  ) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDraggingOver(zone);
    },
    onDragLeave: () => setDraggingOver((current) => (current === zone ? null : current)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDraggingOver(null);
      acceptFile(e.dataTransfer.files?.[0], setFile, formField);
    },
  });

  const renderFilePreview = (file: File, previewUrl: string | null) => {
    if (file.type.startsWith("image/")) {
      return previewUrl ? (
        <img src={previewUrl} alt={file.name} className="size-full object-contain" />
      ) : null;
    }

    if (file.type === "application/pdf") {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-600">
          <FileText className="size-12 text-red-500" />
          <span className="max-w-full truncate px-2 text-xs font-medium">{file.name}</span>
        </div>
      );
    }

    return <p className="text-sm text-gray-500">Preview not available</p>;
  };

  const cacDropHandlers = makeDropHandlers("cac", setCacDocument, "cacDocument");
  const govtIdDropHandlers = makeDropHandlers("govtId", setGovtId, "govtIssuedId");

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">KYC Documents</h2>
        <p className="text-[14px]/5 text-[#71748C]">Let us know more about your business</p>
      </div>

      <div className="flex w-full flex-col gap-7">
        {!isOwner && (
          <div className="flex w-full flex-col gap-1.5">
            <label className="cursor-pointer text-[14px] leading-[17px] font-normal text-[#41415A]">
              CAC Document
            </label>

            {!cacDocument ? (
              <div
                className={cn(
                  "cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-6 text-center transition-colors hover:border-[#D4AF36]",
                  draggingOver === "cac" && "border-[#D4AF36] bg-[#FDF9ED]",
                )}
                onClick={() => cacInputRef.current?.click()}
                {...cacDropHandlers}
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
                onMouseEnter={() => setHoveredDocument("cac")}
                onMouseLeave={() => setHoveredDocument(null)}
              >
                <div className="h-28 w-full max-w-[250px] bg-transparent">
                  {renderFilePreview(cacDocument, cacPreviewUrl)}
                </div>

                <div
                  className={cn(
                    "absolute inset-0 z-10 flex size-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0/20%)] backdrop-blur-[2px] transition-all duration-300",
                    hoveredDocument === "cac" ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                      onClick={handleCacRemove}
                    >
                      <Trash className="size-3.5 text-[#D20832]" />
                      Remove
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                      onClick={handleCacReplace}
                    >
                      <RotateCcw className="size-3.5" />
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={cacInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCacUpload}
              className="hidden"
            />
          </div>
        )}

        <div className="flex w-full flex-col gap-1.5">
          <label className="cursor-pointer text-[14px] leading-[17px] font-normal text-[#41415A]">
            {isOwner ? "Proof of Identity" : "Proof of Address"}
          </label>
          {!govtId ? (
            <div
              className={cn(
                "cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-6 text-center transition-colors hover:border-[#D4AF36]",
                draggingOver === "govtId" && "border-[#D4AF36] bg-[#FDF9ED]",
              )}
              onClick={() => govtIdInputRef.current?.click()}
              {...govtIdDropHandlers}
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
              onMouseEnter={() => setHoveredDocument("govtId")}
              onMouseLeave={() => setHoveredDocument(null)}
            >
              <div className="h-28 w-full max-w-[250px] bg-transparent">
                {renderFilePreview(govtId, govtIdPreviewUrl)}
              </div>

              <div
                className={cn(
                  "absolute inset-0 z-10 flex size-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0/20%)] backdrop-blur-[2px] transition-all duration-300",
                  hoveredDocument === "govtId" ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                    onClick={handleGovtIdRemove}
                  >
                    <Trash className="size-3.5 text-[#D20832]" />
                    Remove
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px]/3.5 font-normal text-black"
                    onClick={handleGovtIdReplace}
                  >
                    <RotateCcw className="size-3.5" />
                    Replace
                  </Button>
                </div>
              </div>
            </div>
          )}
          <input
            ref={govtIdInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleGovtIdUpload}
            className="hidden"
          />

          <p className="text-xs text-[#71748C]">
            {isOwner
              ? "Govt. issued ID or International passport"
              : "E.g. Utility Bill / Bank document / Tenancy-related document"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCDocuments;
