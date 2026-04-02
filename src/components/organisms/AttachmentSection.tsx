"use client";

import { useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  alpha,
  LinearProgress,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  useEmployeeControllerListAttachmentsQuery,
  useEmployeeControllerRemoveAttachmentMutation,
} from "@/lib/redux/api/generatedApi";
import { useEmployeeControllerUploadAttachmentMutation } from "@/lib/redux/api/enhancedApi";

interface AttachmentSectionProps {
  employeeId: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <ImageRoundedIcon sx={{ fontSize: 20 }} />;
  if (mimeType === "application/pdf") return <PictureAsPdfRoundedIcon sx={{ fontSize: 20 }} />;
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  )
    return <DescriptionRoundedIcon sx={{ fontSize: 20 }} />;
  return <InsertDriveFileRoundedIcon sx={{ fontSize: 20 }} />;
}

function getFileColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "#8b5cf6";
  if (mimeType === "application/pdf") return "#ef4444";
  if (mimeType.includes("word") || mimeType.includes("document")) return "#2563eb";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "#16a34a";
  return "#6b7280";
}

interface StagedFile {
  id: string;
  file: File;
  error?: string;
}

export default function AttachmentSection({ employeeId }: AttachmentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const {
    data: attachments = [],
    isLoading,
    isFetching,
  } = useEmployeeControllerListAttachmentsQuery({ id: employeeId });

  const [uploadAttachment, { isLoading: isUploading }] =
    useEmployeeControllerUploadAttachmentMutation();

  const [removeAttachment, { isLoading: isDeleting }] =
    useEmployeeControllerRemoveAttachmentMutation();

  const stageFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newStaged: StagedFile[] = fileArray.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      error:
        file.size > MAX_FILE_SIZE
          ? `Exceeds the 10 MB limit (${formatFileSize(file.size)})`
          : undefined,
    }));
    setStagedFiles((prev) => [...prev, ...newStaged]);
  }, []);

  const removeStagedFile = useCallback((id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearStagedFiles = useCallback(() => {
    setStagedFiles([]);
  }, []);

  const handleSubmitUpload = useCallback(async () => {
    setUploadError(null);
    const validFiles = stagedFiles.filter((sf) => !sf.error);

    if (validFiles.length === 0) return;

    const errors: string[] = [];

    for (const staged of validFiles) {
      try {
        await uploadAttachment({
          id: employeeId,
          body: { file: staged.file } as any,
        }).unwrap();
      } catch {
        errors.push(`Failed to upload "${staged.file.name}".`);
      }
    }

    if (errors.length > 0) {
      setUploadError(errors.join(" "));
    }

    setStagedFiles([]);
  }, [stagedFiles, employeeId, uploadAttachment]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      stageFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.length) {
        stageFiles(e.dataTransfer.files);
      }
    },
    [stageFiles],
  );

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeAttachment({
        id: employeeId,
        attachmentId: deleteTarget.id,
      }).unwrap();
    } catch {
      setUploadError(`Failed to delete "${deleteTarget.name}".`);
    } finally {
      setDeleteTarget(null);
    }
  };

  const validStagedCount = stagedFiles.filter((sf) => !sf.error).length;

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem" }}>
          Attachments
          {attachments.length > 0 && (
            <Chip
              label={attachments.length}
              size="small"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem", fontWeight: 600 }}
            />
          )}
        </Typography>
      </Box>

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          mb: 2,
          p: 3,
          border: "2px dashed",
          borderColor: isDragOver ? "primary.main" : "divider",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          bgcolor: isDragOver ? (t) => alpha(t.palette.primary.main, 0.04) : "transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.light",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />
        <CloudUploadRoundedIcon
          sx={{ fontSize: 36, color: isDragOver ? "primary.main" : "text.disabled", mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          Drag & drop files here or{" "}
          <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            browse
          </Typography>
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Max file size: 10 MB
        </Typography>
      </Box>

      {stagedFiles.length > 0 && (
        <Box
          sx={{
            mb: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Ready to upload ({validStagedCount}{" "}
              {validStagedCount === 1 ? "file" : "files"})
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" onClick={clearStagedFiles} disabled={isUploading}>
                Clear all
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmitUpload}
                disabled={isUploading || validStagedCount === 0}
                startIcon={
                  isUploading ? <CircularProgress size={16} /> : <CloudUploadRoundedIcon />
                }
              >
                {isUploading ? "Uploading…" : "Upload"}
              </Button>
            </Box>
          </Box>

          {isUploading && <LinearProgress />}

          <Box sx={{ p: 1 }}>
            {stagedFiles.map((staged) => {
              const color = getFileColor(staged.file.type);
              return (
                <Box
                  key={staged.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: (t) => alpha(t.palette.action.hover, 0.04),
                    },
                    opacity: staged.error ? 0.6 : 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(color, 0.1),
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {getFileIcon(staged.file.type)}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                      {staged.file.name}
                    </Typography>
                    {staged.error ? (
                      <Typography variant="caption" color="error">
                        {staged.error}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(staged.file.size)}
                      </Typography>
                    )}
                  </Box>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => removeStagedFile(staged.id)}
                      disabled={isUploading}
                      sx={{ flexShrink: 0 }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {uploadError && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {uploadError}
        </Typography>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : attachments.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No attachments yet
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "10px",
            overflow: "auto",
            opacity: isFetching ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attachments.map((att) => {
                const color = getFileColor(att.mimeType);
                return (
                  <TableRow key={att.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha(color, 0.1),
                            color,
                            flexShrink: 0,
                          }}
                        >
                          {getFileIcon(att.mimeType)}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                            {att.originalName}
                          </Typography>
                          {att.label && (
                            <Typography variant="caption" color="text.secondary">
                              {att.label}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(att.size)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(att.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(att.url, att.originalName)}
                          >
                            <DownloadRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteTarget({ id: att.id, name: att.originalName })
                            }
                          >
                            <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {attachments.length} {attachments.length === 1 ? "file" : "files"}
        </Typography>
      </Box>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Attachment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : undefined}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
