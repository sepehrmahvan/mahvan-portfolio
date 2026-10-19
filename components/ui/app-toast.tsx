"use client";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type AppToastProps = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
  autoHideDuration?: number;
};

export function AppToast({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 4000,
}: AppToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
