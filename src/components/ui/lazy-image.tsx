import { useState, type ComponentPropsWithoutRef } from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ComponentPropsWithoutRef<"img"> {
  containerClassName?: string;
  skeletonClassName?: string;
}

/**
 * Drop-in replacement for a plain <img> that defers offscreen loading to the browser
 * (loading="lazy" + decoding="async") and shows a skeleton placeholder - matching the image's
 * own size, so the layout doesn't jump - until the image has actually loaded or failed. Falls
 * back to a plain muted block on error rather than a broken-image icon.
 */
export function LazyImage({
  className,
  containerClassName,
  skeletonClassName,
  alt,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={cn("relative", containerClassName)}>
      {status !== "loaded" && (
        <Skeleton
          className={cn("absolute inset-0 size-full", skeletonClassName)}
          aria-hidden="true"
        />
      )}
      {status === "error" ? (
        <div
          className={cn(
            "bg-muted text-muted-foreground flex size-full items-center justify-center text-xs",
            className,
          )}
          role="img"
          aria-label={alt}
        >
          {alt || "Image unavailable"}
        </div>
      ) : (
        <img
          {...props}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(className, status === "loading" && "invisible")}
          onLoad={(e) => {
            setStatus("loaded");
            onLoad?.(e);
          }}
          onError={(e) => {
            setStatus("error");
            onError?.(e);
          }}
        />
      )}
    </div>
  );
}
