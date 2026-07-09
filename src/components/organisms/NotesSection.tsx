"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Card,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {
  useEmployeeControllerListNotesQuery,
  useEmployeeControllerAddNoteMutation,
  useEmployeeControllerUpdateNoteMutation,
  useEmployeeControllerRemoveNoteMutation,
} from "@/lib/redux/api/enhancedApi";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import MarkdownContent from "@/components/molecules/MarkdownContent";

interface NotesSectionProps {
  employeeId: string;
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

function initialsOf(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function NotesSection({ employeeId }: NotesSectionProps) {
  const {
    data: notes = [],
    isLoading,
  } = useEmployeeControllerListNotesQuery({ id: employeeId });

  const [addNote, { isLoading: isAdding }] = useEmployeeControllerAddNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useEmployeeControllerUpdateNoteMutation();
  const [removeNote, { isLoading: isDeleting }] = useEmployeeControllerRemoveNoteMutation();

  const [isComposing, setIsComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!draft.trim()) return;
    setError(null);
    try {
      await addNote({ id: employeeId, createNoteDto: { content: draft.trim() } }).unwrap();
      setDraft("");
      setIsComposing(false);
    } catch {
      setError("Failed to save the note. Please try again.");
    }
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditDraft(content);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!editingId || !editDraft.trim()) return;
    setError(null);
    try {
      await updateNote({
        id: employeeId,
        noteId: editingId,
        updateNoteDto: { content: editDraft.trim() },
      }).unwrap();
      setEditingId(null);
      setEditDraft("");
    } catch {
      setError("Failed to update the note. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setError(null);
    try {
      await removeNote({ id: employeeId, noteId: deleteTargetId }).unwrap();
    } catch {
      setError("Failed to delete the note. Please try again.");
    } finally {
      setDeleteTargetId(null);
    }
  };

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
          Notes
          {notes.length > 0 && (
            <Chip
              label={notes.length}
              size="small"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem", fontWeight: 600 }}
            />
          )}
        </Typography>
        {!isComposing && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => setIsComposing(true)}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Add Note
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isComposing && (
        <Card sx={{ p: 2, mb: 3 }}>
          <MarkdownEditor
            value={draft}
            onChange={setDraft}
            autoFocus
            placeholder="Add a note about this employee… (Markdown supported)"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
            <Button
              onClick={() => {
                setIsComposing(false);
                setDraft("");
              }}
              disabled={isAdding}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={isAdding || !draft.trim()}
              startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              {isAdding ? "Saving…" : "Save Note"}
            </Button>
          </Box>
        </Card>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : notes.length === 0 && !isComposing ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: "10px",
          }}
        >
          <NoteAltRoundedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No notes yet. Add the first note for this employee.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {notes.map((note) => (
            <Card key={note.id} sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      bgcolor: "primary.main",
                    }}
                  >
                    {note.createdByName ? (
                      initialsOf(note.createdByName)
                    ) : (
                      <PersonRoundedIcon sx={{ fontSize: 16 }} />
                    )}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
                      {note.createdByName || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(note.createdAt)}
                      {note.updatedAt !== note.createdAt && " · edited"}
                    </Typography>
                  </Box>
                </Box>

                {editingId !== note.id && (
                  <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => startEdit(note.id, note.content)}>
                        <EditRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTargetId(note.id)}
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              {editingId === note.id ? (
                <Box>
                  <MarkdownEditor value={editDraft} onChange={setEditDraft} autoFocus />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setEditDraft("");
                      }}
                      disabled={isUpdating}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={isUpdating || !editDraft.trim()}
                      startIcon={
                        isUpdating ? <CircularProgress size={16} color="inherit" /> : undefined
                      }
                      sx={{ textTransform: "none", borderRadius: "8px" }}
                    >
                      {isUpdating ? "Saving…" : "Save Changes"}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <MarkdownContent content={note.content} />
              )}
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTargetId(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
