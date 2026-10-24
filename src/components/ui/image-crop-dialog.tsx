import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  IconButton,
  Button,
  Box,
  Typography,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export interface ImageCropDialogProps {
  open: boolean;
  file: File | null;
  /** Width / height ratio of the crop area. Defaults to a 1:1 square. */
  aspect?: number;
  /** "round" for avatars/logos, "rect" for banners and wider assets. */
  cropShape?: "round" | "rect";
  title?: string;
  /** The exported image's longest edge is capped at this many pixels. */
  maxOutputDimension?: number;
  /** The exported blob is iteratively re-compressed to stay under this size. */
  maxOutputBytes?: number;
  onClose: () => void;
  onCropComplete: (dataUrl: string) => void;
}

// Scoped MUI theme matching Geoplox's gold brand accent (oklch(0.7665 0.1393 91.15) ~ #D4A017)
// so the dialog's buttons/slider read as part of the app, not a bolted-on library default.
const cropTheme = createTheme({
  palette: {
    primary: { main: "#C99A1E" },
  },
  shape: { borderRadius: 16 },
});

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.crossOrigin = "anonymous";
    img.src = src;
  });

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const getRotatedRectSize = (width: number, height: number, rotation: number) => {
  const rad = degToRad(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
};

async function buildCroppedImage(
  imageSrc: string,
  croppedAreaPixels: Area,
  rotation: number,
  maxOutputDimension: number,
  maxOutputBytes: number,
): Promise<string> {
  const image = await loadImage(imageSrc);

  // Rotate the full source image onto an oversized canvas first, so cropping a rotated
  // selection never clips into transparent/out-of-bounds pixels.
  const rotatedSize = getRotatedRectSize(image.width, image.height, rotation);
  const rotateCanvas = document.createElement("canvas");
  rotateCanvas.width = rotatedSize.width;
  rotateCanvas.height = rotatedSize.height;
  const rotateCtx = rotateCanvas.getContext("2d");
  if (!rotateCtx) throw new Error("Canvas 2D context unavailable");

  rotateCtx.translate(rotatedSize.width / 2, rotatedSize.height / 2);
  rotateCtx.rotate(degToRad(rotation));
  rotateCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Crop the rotated canvas down to the selected area at full source resolution.
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = croppedAreaPixels.width;
  cropCanvas.height = croppedAreaPixels.height;
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("Canvas 2D context unavailable");

  cropCtx.drawImage(
    rotateCanvas,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  // Downscale if the crop exceeds our output cap (keeps uploads sane while still "ultra
  // high definition" -- most avatars/logos never need more than ~2000px on the long edge).
  let finalCanvas = cropCanvas;
  const longestEdge = Math.max(cropCanvas.width, cropCanvas.height);
  if (longestEdge > maxOutputDimension) {
    const scale = maxOutputDimension / longestEdge;
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = Math.round(cropCanvas.width * scale);
    scaledCanvas.height = Math.round(cropCanvas.height * scale);
    const scaledCtx = scaledCanvas.getContext("2d");
    if (!scaledCtx) throw new Error("Canvas 2D context unavailable");
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = "high";
    scaledCtx.drawImage(cropCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    finalCanvas = scaledCanvas;
  }

  // Re-encode at decreasing quality until the blob fits the size budget.
  let quality = 0.92;
  for (let attempt = 0; attempt < 8; attempt++) {
    const dataUrl = finalCanvas.toDataURL("image/jpeg", quality);
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    if (blob.size <= maxOutputBytes || quality <= 0.5) {
      return dataUrl;
    }
    quality -= 0.08;
  }
  return finalCanvas.toDataURL("image/jpeg", 0.5);
}

export function ImageCropDialog({
  open,
  file,
  aspect = 1,
  cropShape = "round",
  title = "Adjust your image",
  maxOutputDimension = 2000,
  maxOutputBytes = 1024 * 1024,
  onClose,
  onCropComplete,
}: ImageCropDialogProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const dataUrl = await buildCroppedImage(
        imageSrc,
        croppedAreaPixels,
        rotation,
        maxOutputDimension,
        maxOutputBytes,
      );
      onCropComplete(dataUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  const cropAreaStyle = useMemo(
    () => ({
      containerStyle: { borderRadius: 16 },
    }),
    [],
  );

  return (
    <ThemeProvider theme={cropTheme}>
      <Dialog
        open={open && !!file}
        onClose={(_e, reason) => {
          if (reason === "backdropClick" && isProcessing) return;
          onClose();
        }}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              overflow: "hidden",
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 2.5,
            pb: 1.5,
          }}
        >
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700, fontSize: 17 }}>
            {title}
          </Typography>
          <IconButton size="small" onClick={onClose} disabled={isProcessing}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 320,
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#111214",
            }}
          >
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                cropShape={cropShape}
                showGrid={cropShape === "rect"}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={handleCropComplete}
                style={cropAreaStyle}
                restrictPosition
              />
            )}
          </Box>

          <Stack spacing={2.25} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <ZoomOutRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Slider
                size="small"
                value={zoom}
                min={1}
                max={3}
                step={0.01}
                onChange={(_e, value) => setZoom(value as number)}
                aria-label="Zoom"
              />
              <ZoomInRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Tooltip title="Rotate left">
                <IconButton
                  size="small"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                >
                  <RotateLeftRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate right">
                <IconButton size="small" onClick={() => setRotation((r) => (r + 90) % 360)}>
                  <RotateRightRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset">
                <IconButton size="small" onClick={handleReset}>
                  <RestartAltRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            disabled={isProcessing}
            sx={{ borderRadius: 99, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            disabled={isProcessing || !croppedAreaPixels}
            startIcon={
              isProcessing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckRoundedIcon />
              )
            }
            sx={{
              borderRadius: 99,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {isProcessing ? "Applying…" : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
