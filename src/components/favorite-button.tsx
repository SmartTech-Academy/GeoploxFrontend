import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAddToFavorites, useRemoveFromFavorites } from "@/lib/services";
import { useGetProfileData } from "@/lib/services/profile";

interface FavoriteButtonProps {
  propertyId: string;
  isFavorited?: boolean;
  /** "overlay" sits on top of a photo (dark backdrop, white icon). "inline" sits in normal flow. */
  variant?: "overlay" | "inline";
  className?: string;
}

/**
 * Self-contained favourite toggle: owns its own auth check, mutation, optimistic
 * state, and tactile feedback, so every card/detail page can drop in one component
 * and get consistent, functional favouriting instead of a decorative Heart icon.
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  isFavorited = false,
  variant = "overlay",
  className,
}) => {
  const navigate = useNavigate();
  const { data: user } = useGetProfileData();
  const [favorited, setFavorited] = useState(isFavorited);

  // Re-sync local optimistic state when this instance starts representing a different
  // property (e.g. navigating detail pages without remounting), following React's
  // "adjust state during render" pattern instead of an effect.
  const [trackedPropertyId, setTrackedPropertyId] = useState(propertyId);
  if (propertyId !== trackedPropertyId) {
    setTrackedPropertyId(propertyId);
    setFavorited(isFavorited);
  }

  const { mutate: addToFavorites, isPending: isAdding } = useAddToFavorites();
  const { mutate: removeFromFavorites, isPending: isRemoving } = useRemoveFromFavorites([
    "property",
  ]);
  const isPending = isAdding || isRemoving;

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.error("Please log in to add to favorite");
      navigate({ to: "/login" });
      return;
    }

    if (favorited) {
      setFavorited(false);
      removeFromFavorites(propertyId, {
        onError: () => setFavorited(true),
      });
    } else {
      setFavorited(true);
      addToFavorites(propertyId, {
        onError: () => setFavorited(false),
      });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favourites" : "Save to favourites"}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center transition-transform duration-150 ease-out active:scale-90 disabled:opacity-60",
        variant === "overlay" &&
          "size-9 rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/40",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-5 transition-all duration-200 ease-out",
          variant === "overlay" && "size-5 text-white",
          variant === "inline" && "mr-2 size-4 text-[#1A2258]",
          favorited && "scale-110 fill-red-500 text-red-500",
        )}
      />
      {variant === "inline" && (favorited ? "Saved" : "Save to Favourites")}
    </button>
  );
};
