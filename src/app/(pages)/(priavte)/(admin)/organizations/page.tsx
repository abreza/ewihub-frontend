"use client";

import { useState, useMemo } from "react";
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, TextField, Typography, InputAdornment,
  alpha, Avatar, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Tooltip, Switch, FormControlLabel,
  Stack, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/navigation";
import {
  useOrganizationControllerFindAllQuery,
  useOrganizationControllerCreateMutation,
  useOrganizationControllerRemoveMutation,
} from "@/lib/redux/api/generatedApi";

const COURSE_OPTIONS = ["Office Ergonomics", "Self Assessment"];

export default function OrganizationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [formName, setFormName] = useState("");
  const [formAbbreviation, setFormAbbreviation] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formCourses, setFormCourses] = useState<string[]>([]);
  const [formEnableDepartments, setFormEnableDepartments] = useState(false);
  const [formActive, setFormActive] = useState(true);

  const { data: organizations, isLoading } = useOrganizationControllerFindAllQuery();
  const [createOrg, { isLoading: isCreating }] = useOrganizationControllerCreateMutation();
  const [removeOrg, { isLoading: isDeleting }] = useOrganizationControllerRemoveMutation();

  const filtered = useMemo(() => {
    if (!organizations) return [];
    if (!searchTerm.trim()) return organizations;
    const term = searchTerm.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(term) ||
        org.abbreviation.toLowerCase().includes(term)
    );
  }, [organizations, searchTerm]);

  const resetForm = () => {
    setFormName("");
    setFormAbbreviation("");
    setFormNotes("");
    setFormCourses([]);
    setFormEnableDepartments(false);
    setFormActive(true);
  };

  const handleCreate = async () => {
    try {
      await createOrg({
        createOrganizationDto: {
          name: formName,
          abbreviation: formAbbreviation,
          notes: formNotes || undefined,
          courses: formCourses,
          enableDepartments: formEnableDepartments,
          active: formActive,
        },
      }).unwrap();
      setCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to create organization:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeOrg({ id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete organization:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const colors = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#dc2626", "#ea580c"];

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>
            Organizations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage organizations, API keys, and course assignments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Add Organization
        </Button>
      </Box>

      <Card>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {organizations?.length ?? 0}
            </Typography>{" "}
            organizations
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 280 },
              "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "30%" }}>Organization</TableCell>
                  <TableCell>API Key</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((org, i) => (
                  <TableRow
                    key={org.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#fafbfc" },
                      transition: "background 0.15s",
                    }}
                    onClick={() => router.push(`/organizations/${org.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={org.logo || undefined}
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: alpha(colors[i % colors.length], 0.1),
                            color: colors[i % colors.length],
                            display: { xs: "none", sm: "flex" },
                          }}
                        >
                          {org.abbreviation.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {org.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {org.abbreviation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            bgcolor: "#f1f5f9",
                            px: 1,
                            py: 0.25,
                            borderRadius: "4px",
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {org.apiKey}
                        </Typography>
                        <Tooltip title="Copy API key">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(org.apiKey);
                            }}
                          >
                            <ContentCopyRoundedIcon sx={{ fontSize: "0.9rem" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {org.courses.map((course) => (
                          <Chip
                            key={course}
                            label={course}
                            size="small"
                            sx={{
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "0.65rem",
                              height: 22,
                              bgcolor: alpha("#2563eb", 0.08),
                              color: "#2563eb",
                            }}
                          />
                        ))}
                        {org.courses.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            None
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.active ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 24,
                          bgcolor: org.active ? "#dcfce7" : "#f1f5f9",
                          color: org.active ? "#15803d" : "#64748b",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/organizations/${org.id}`);
                            }}
                          >
                            <EditRoundedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget({ id: org.id, name: org.name });
                            }}
                          >
                            <DeleteRoundedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No organizations found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      {/* Create Organization Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => { setCreateOpen(false); resetForm(); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Organization</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Organization Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Abbreviation"
              value={formAbbreviation}
              onChange={(e) => setFormAbbreviation(e.target.value)}
              fullWidth
              required
              size="small"
              helperText="Short identifier for the organization"
            />
            <TextField
              label="Notes"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Courses</InputLabel>
              <Select
                multiple
                value={formCourses}
                onChange={(e) => setFormCourses(e.target.value as string[])}
                label="Courses"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {selected.map((v) => (
                      <Chip key={v} label={v} size="small" sx={{ height: 22, fontSize: "0.75rem" }} />
                    ))}
                  </Box>
                )}
              >
                {COURSE_OPTIONS.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formEnableDepartments}
                    onChange={(e) => setFormEnableDepartments(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Enable Departments</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Active</Typography>}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setCreateOpen(false); resetForm(); }} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formName.trim() || !formAbbreviation.trim() || isCreating}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isCreating ? <CircularProgress size={18} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Organization</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isDeleting ? <CircularProgress size={18} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
