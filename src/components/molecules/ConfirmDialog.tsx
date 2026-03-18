"use client";

import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  confirmColor?: "error" | "warning" | "primary";
  isLoading?: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirm",
  confirmColor = "primary",
  isLoading = false,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700, color: confirmColor === "error" ? "#dc2626" : undefined }}>
      {title}
    </DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ textTransform: "none" }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color={confirmColor}
        onClick={onConfirm}
        disabled={isLoading}
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        {isLoading ? <CircularProgress size={18} /> : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
