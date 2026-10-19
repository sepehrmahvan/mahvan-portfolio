"use client";

import Box from "@mui/material/Box";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { XIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import {
  getModalTransition,
  modalTransitionDuration,
} from "./modal-transitions";
import {
  modalBackdropSx,
  modalPaperSx,
  type ModalAnimation,
} from "./modal-styles";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<ModalSize, DialogProps["maxWidth"]> = {
  sm: "xs",
  md: "sm",
  lg: "md",
  xl: "lg",
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  animation?: ModalAnimation;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  fullWidth?: boolean;
  fullScreen?: boolean;
  /** When false, removes header/footer divider lines. */
  divided?: boolean;
  className?: string;
  contentClassName?: string;
  slots?: DialogProps["slots"];
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
} & Omit<
  DialogProps,
  | "open"
  | "onClose"
  | "title"
  | "children"
  | "maxWidth"
  | "fullWidth"
  | "fullScreen"
  | "slots"
>;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  animation = "scale",
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  fullWidth = true,
  fullScreen = false,
  divided = true,
  className,
  contentClassName,
  slotProps,
  sx,
  slots: externalSlots,
  ...props
}: ModalProps) {
  const { t } = useTranslation("common");
  const titleId = props["aria-labelledby"] ?? "app-modal-title";
  const descriptionId = props["aria-describedby"] ?? "app-modal-description";
  const TransitionComponent = getModalTransition(animation);
  const hasHeader = Boolean(title || description || !hideCloseButton);

  const handleClose: DialogProps["onClose"] = (_event, reason) => {
    if (reason === "backdropClick" && !closeOnBackdropClick) return;
    if (reason === "escapeKeyDown" && !closeOnEscape) return;
    onClose();
  };

  return (
    <Dialog
      {...props}
      open={open}
      onClose={handleClose}
      keepMounted={false}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      maxWidth={sizeMap[size]}
      className={className}
      slots={{
        ...externalSlots,
        transition: TransitionComponent,
      }}
      slotProps={{
        ...slotProps,
        transition: {
          ...(typeof slotProps?.transition === "object"
            ? slotProps.transition
            : {}),
          timeout: modalTransitionDuration,
        },
        backdrop: {
          ...(typeof slotProps?.backdrop === "object"
            ? slotProps.backdrop
            : {}),
          transitionDuration: modalTransitionDuration,
          sx: {
            ...modalBackdropSx,
            ...(typeof slotProps?.backdrop === "object" &&
            slotProps.backdrop &&
            "sx" in slotProps.backdrop
              ? slotProps.backdrop.sx
              : {}),
          },
        },
        paper: {
          ...(typeof slotProps?.paper === "object" ? slotProps.paper : {}),
          sx: {
            ...modalPaperSx,
            ...(typeof slotProps?.paper === "object" &&
            slotProps.paper &&
            "sx" in slotProps.paper
              ? slotProps.paper.sx
              : {}),
          },
        },
      }}
      sx={sx}
    >
      {hasHeader ? (
        <Box
          sx={{
            position: "relative",
            px: 3,
            pt: 3,
            pb: description ? 1 : 2,
            borderBottom: divided && (children || footer) ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          {!hideCloseButton ? (
            <IconButton
              aria-label={t("close")}
              onClick={onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                insetInlineEnd: 12,
                color: "text.secondary",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                  color: "text.primary",
                },
              }}
            >
              <XIcon aria-hidden size={20} weight="bold" />
            </IconButton>
          ) : null}

          {title ? (
            <DialogTitle
              id={titleId}
              sx={{
                p: 0,
                pr: hideCloseButton ? 0 : 5,
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.5,
              }}
            >
              {title}
            </DialogTitle>
          ) : null}

          {description ? (
            <Typography
              id={descriptionId}
              variant="body2"
              sx={{ mt: title ? 1 : 0, pr: hideCloseButton ? 0 : 5, color: "text.secondary" }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      {children ? (
        <DialogContent
          className={contentClassName}
          sx={{
            px: 3,
            py: 2.5,
            "&.MuiDialogContent-root": {
              pt: hasHeader ? 2.5 : 3,
            },
          }}
        >
          {children}
        </DialogContent>
      ) : null}

      {footer ? (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
            borderTop: divided ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          {footer}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}

export type ModalBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <Box className={className} sx={{ px: 3, py: 2.5 }}>
      {children}
    </Box>
  );
}

export type ModalFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: 1,
        px: 3,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      {children}
    </Box>
  );
}
