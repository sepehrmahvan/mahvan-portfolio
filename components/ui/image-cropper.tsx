"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import Cropper, { type Area, type MediaSize, type Point, type Size } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "@/hooks/use-translation";
import {
  getCroppedImageFile,
  HERO_IMAGE_ASPECT_RATIO,
  type CropAreaPixels,
} from "@/utils/crop-image";

function getContainMinZoom(media: Size, crop: Size) {
  if (media.width <= 0 || media.height <= 0 || crop.width <= 0 || crop.height <= 0) {
    return 1;
  }

  return Math.min(crop.width / media.width, crop.height / media.height);
}

export type ImageCropperProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (file: File) => void | Promise<void>;
  aspect?: number;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  fileName?: string;
  mimeType?: string;
  /** Opaque fill behind the crop. Pass `null` to keep PNG transparency. */
  background?: string | null;
};

export function ImageCropper({
  open,
  imageSrc,
  onClose,
  onConfirm,
  aspect = HERO_IMAGE_ASPECT_RATIO,
  title,
  confirmLabel,
  cancelLabel,
  fileName,
  mimeType = "image/jpeg",
  background,
}: ImageCropperProps) {
  const { t } = useTranslation();
  const mediaSizeRef = useRef<MediaSize | null>(null);
  const cropSizeRef = useRef<Size | null>(null);
  const hasFittedRef = useRef(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropAreaPixels | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropperReady, setCropperReady] = useState(false);

  const resetState = useCallback(() => {
    mediaSizeRef.current = null;
    cropSizeRef.current = null;
    hasFittedRef.current = false;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMinZoom(1);
    setCroppedAreaPixels(null);
    setCropperReady(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    // Wait for fade-in so cropper measures the final modal size.
    const timer = window.setTimeout(() => {
      setCropperReady(true);
    }, 80);

    return () => {
      window.clearTimeout(timer);
      resetState();
    };
  }, [open, imageSrc, resetState]);

  const applyInitialFit = useCallback(() => {
    if (hasFittedRef.current) return;

    const media = mediaSizeRef.current;
    const cropFrame = cropSizeRef.current;
    if (!media || !cropFrame) return;

    const fittedZoom = Math.max(
      0.05,
      getContainMinZoom(
        { width: media.width, height: media.height },
        cropFrame,
      ),
    );

    hasFittedRef.current = true;
    setMinZoom(fittedZoom);
    setZoom(fittedZoom);
    setCrop({ x: 0, y: 0 });
  }, []);

  const handleMediaLoaded = useCallback(
    (mediaSize: MediaSize) => {
      mediaSizeRef.current = mediaSize;
      applyInitialFit();
    },
    [applyInitialFit],
  );

  const handleCropSizeChange = useCallback(
    (size: Size) => {
      cropSizeRef.current = size;
      applyInitialFit();
    },
    [applyInitialFit],
  );

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleClose = () => {
    if (isProcessing) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels || isProcessing) return;

    setIsProcessing(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, {
        fileName:
          fileName ??
          `hero-crop-${Date.now()}.${mimeType === "image/png" ? "png" : "jpg"}`,
        mimeType,
        background,
      });
      await onConfirm(file);
    } catch {
      // Parent handles error UI; keep cropper open for retry.
    } finally {
      setIsProcessing(false);
    }
  };

  const maxZoom = Math.max(minZoom * 4, minZoom + 2);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title ?? t("common.imageCropper.title")}
      size="lg"
      animation="fade"
      closeOnBackdropClick={!isProcessing}
      closeOnEscape={!isProcessing}
      footer={
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {cancelLabel ?? t("common.actions.cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => void handleConfirm()}
            disabled={isProcessing || !croppedAreaPixels}
          >
            <span className="inline-flex items-center gap-2">
              {isProcessing ? (
                <CircularProgress size={16} color="inherit" />
              ) : null}
              <span>{confirmLabel ?? t("common.actions.confirm")}</span>
            </span>
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-[min(55vh,22rem)] w-full overflow-hidden rounded-2xl bg-black">
          {cropperReady && imageSrc ? (
            <Cropper
              key={imageSrc}
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              minZoom={minZoom}
              maxZoom={maxZoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={handleMediaLoaded}
              onCropSizeChange={handleCropSizeChange}
              objectFit="contain"
              restrictPosition={false}
              showGrid
            />
          ) : null}
        </div>

        <div className="px-1">
          <p className="mb-2 text-sm text-platform-gray">
            {t("common.imageCropper.zoom")}
          </p>
          <Slider
            value={zoom}
            min={minZoom}
            max={maxZoom}
            step={0.01}
            aria-label={t("common.imageCropper.zoom")}
            onChange={(_event, value) => setZoom(value as number)}
            disabled={isProcessing || !cropperReady}
            color="primary"
          />
          <p className="mt-2 text-xs text-platform-gray-light sm:text-sm">
            {t("common.imageCropper.fullWidthHint")}
          </p>
        </div>
      </div>
    </Modal>
  );
}
