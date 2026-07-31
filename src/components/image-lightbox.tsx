import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn, downloadImage } from "@/lib/utils";
import { LazyImage } from "@/components/ui/lazy-image";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange?: (index: number) => void;
  alt?: string;
}

/**
 * Full-screen image gallery viewer. Built directly on the Radix dialog primitives
 * (rather than the opinionated white-card `DialogContent`) so the overlay, sizing,
 * and transitions can be fully custom for an immersive photo-viewing experience.
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  open,
  onOpenChange,
  onIndexChange,
  alt = "Property image",
}) => {
  const [index, setIndex] = useState(initialIndex);

  // Reset to the initial index each time the lightbox opens, following React's
  // "adjust state during render" pattern instead of an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setIndex(initialIndex);
  }

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    onIndexChange?.(nextIndex);
  };

  const goPrev = () => goTo((index - 1 + images.length) % images.length);
  const goNext = () => goTo((index + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);

  const handleDownload = () => {
    const url = images[index];
    if (!url) return;
    downloadImage(url, `geoplox-${alt.toLowerCase().replace(/\s+/g, "-")}-${index + 1}.jpg`);
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/90 backdrop-blur-md" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-300",
          )}
        >
          <DialogTitle className="sr-only">{alt} gallery</DialogTitle>

          <DialogClose className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden">
            {images.length > 1 && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            <img
              key={index}
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              className="animate-in fade-in-0 zoom-in-95 max-h-full max-w-full rounded-lg object-contain duration-300"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Download className="size-4" />
              Download
            </button>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {index + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex max-w-full gap-2 overflow-x-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "size-14 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                    i === index
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-60 hover:opacity-90",
                  )}
                >
                  <LazyImage
                    src={img}
                    alt=""
                    containerClassName="size-full"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
