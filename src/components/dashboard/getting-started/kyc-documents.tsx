'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, RotateCcw, Trash } from 'lucide-react';
import type React from 'react';
import { useState, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface KYCDocumentsProps {
  form: UseFormReturn<any>;
}

const KYCDocuments: React.FC<KYCDocumentsProps> = ({ form }) => {
  const [cacDocument, setCacDocument] = useState<File | null>(null);
  const [govtId, setGovtId] = useState<File | null>(null);
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);

  const cacInputRef = useRef<HTMLInputElement>(null);
  const govtIdInputRef = useRef<HTMLInputElement>(null);

  const handleCacUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCacDocument(file);
      form.setValue('cacDocument', file);
    }
  };

  const handleGovtIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGovtId(file);
      form.setValue('govtIssuedId', file);
    }
  };

  const handleCacRemove = () => {
    setCacDocument(null);
    form.setValue('cacDocument', null);
    if (cacInputRef.current) {
      cacInputRef.current.value = '';
    }
  };

  const handleGovtIdRemove = () => {
    setGovtId(null);
    form.setValue('govtIssuedId', null);
    if (govtIdInputRef.current) {
      govtIdInputRef.current.value = '';
    }
  };

  const handleCacReplace = () => {
    cacInputRef.current?.click();
  };

  const handleGovtIdReplace = () => {
    govtIdInputRef.current?.click();
  };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-contain" />;
    }

    if (file.type === 'application/pdf') {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-600">
          <FileText className="size-12 text-red-500" />
          <span className="max-w-full truncate px-2 text-xs font-medium">{file.name}</span>
        </div>
      );
    }

    return <p className="text-sm text-gray-500">Preview not available</p>;
  };

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">KYC Documents</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Let us know more about your business</p>
      </div>

      <div className="flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-1.5">
          <label className="cursor-pointer text-[14px] leading-[17px] font-normal text-[#41415A]">CAC Document</label>

          {!cacDocument ? (
            <div
              className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-6 text-center transition-colors hover:border-[#D4AF36]"
              onClick={() => cacInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-[14px] leading-[17px] text-[#71748C]">
                  Drag and drop here or{' '}
                  <span className="cursor-pointer font-semibold text-[#B69118]">click to upload</span>
                </p>
                <p className="text-[10px] leading-[12px] text-[#71748C]">
                  Supports PDF, JPEG, or PNG files. Smaller than 1 MB
                </p>
              </div>
            </div>
          ) : (
            <div
              className="relative flex w-full items-center justify-center self-stretch rounded-[6px] bg-[#E3E3E8] py-3"
              onMouseEnter={() => setHoveredDocument('cac')}
              onMouseLeave={() => setHoveredDocument(null)}
            >
              <div className="h-[112px] w-[250px] bg-transparent">{renderFilePreview(cacDocument)}</div>

              <div
                className={cn(
                  'absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0_/_20%)] backdrop-blur-[2px] transition-all duration-300',
                  hoveredDocument === 'cac' ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
              >
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px] leading-[14px] font-normal text-black"
                    onClick={handleCacRemove}
                  >
                    <Trash className="size-[14px] text-[#D20832]" />
                    Remove
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px] leading-[14px] font-normal text-black"
                    onClick={handleCacReplace}
                  >
                    <RotateCcw className="size-[14px]" />
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

        <div className="flex w-full flex-col gap-1.5">
          <label className="cursor-pointer text-[14px] leading-[17px] font-normal text-[#41415A]">
            Govt. Issued ID
          </label>
          {!govtId ? (
            <div
              className="cursor-pointer rounded-[2px] border border-dashed border-[#D5D5DD] px-3 py-6 text-center transition-colors hover:border-[#D4AF36]"
              onClick={() => govtIdInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-[14px] leading-[17px] text-[#71748C]">
                  Drag and drop here or{' '}
                  <span className="cursor-pointer font-semibold text-[#B69118]">click to upload</span>
                </p>
                <p className="text-[10px] leading-[12px] text-[#71748C]">
                  Supports PDF, JPEG, or PNG files. Smaller than 1 MB
                </p>
              </div>
            </div>
          ) : (
            <div
              className="relative flex w-full items-center justify-center self-stretch rounded-[6px] bg-[#E3E3E8] py-3"
              onMouseEnter={() => setHoveredDocument('govtId')}
              onMouseLeave={() => setHoveredDocument(null)}
            >
              <div className="h-[112px] w-[250px] bg-transparent">{renderFilePreview(govtId)}</div>

              <div
                className={cn(
                  'absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-[6px] bg-[oklch(0_0_0_/_20%)] backdrop-blur-[2px] transition-all duration-300',
                  hoveredDocument === 'govtId' ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
              >
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px] leading-[14px] font-normal text-black"
                    onClick={handleGovtIdRemove}
                  >
                    <Trash className="size-[14px] text-[#D20832]" />
                    Remove
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-[30px] rounded-[40px] bg-white px-6 py-2 text-[12px] leading-[14px] font-normal text-black"
                    onClick={handleGovtIdReplace}
                  >
                    <RotateCcw className="size-[14px]" />
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
            E.g. National Identity Number / Driving License / Int&apos;l Passport
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCDocuments;
