"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Typography,
  alpha, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Stack,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useRouter } from "next/navigation";
import {
  useOrganizationControllerFindAllQuery,
  useOrganizationControllerCreateMutation,
  useOrganizationControllerRemoveMutation,
} from "@/lib/redux/api/generatedApi";
import { AVATAR_COLORS } from "@/constants";
import PageHeader from "@/components/atoms/PageHeader";
import SearchField from "@/components/atoms/SearchField";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import ApiKeyDisplay from "@/components/molecules/ApiKeyDisplay";
import OrgFormFields, { type OrgFormValues } from "@/components/organisms/OrgFormFields";
import { IconButton, Tooltip } from "@mui/material";
import { DEFAULT_FOLLOW_UP_STATUSES } from "@/constants";

const EMPTY_FORM: OrgFormValues = {
  name: "",
  abbreviation: "",
  notes: "",
  courses: [],
  enableDepartments: false,
  enableFollowUpStatus: false,
  followUpStatuses: [...DEFAULT_FOLLOW_UP_STATUSES],
  active: true,
};

export default function OrganizationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<OrgFormValues>(EMPTY_FORM);

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
        org.abbreviation.toLowerCase().includes(term),
    );
  }, [organizations, searchTerm]);

  const handleFormChange = useCallback(
    <K extends keyof OrgFormValues>(field: K, value: OrgFormValues[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resetForm = () => setForm(EMPTY_FORM);

  const handleCreate = async () => {
    try {
      await createOrg({
        createOrganizationDto: {
          name: form.name,
          abbreviation: form.abbreviation,
          notes: form.notes || undefined,
          courses: form.courses,
          enableDepartments: form.enableDepartments,
          active: form.active,
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

  return (
    <Box>
      <PageHeader
        title="Organizations"
        subtitle="Manage organizations, API keys, and course assignments"
        action={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Add Organization
          </Button>
        }
      />

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
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search organizations..."
            width={{ xs: "100%", sm: 280 }}
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
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#fafbfc" }, transition: "background 0.15s" }}
                    onClick={() => router.push(`/organizations/${org.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={org.logo || undefined}
                          sx={{
                            width: 34, height: 34, fontSize: "0.7rem", fontWeight: 700,
                            bgcolor: alpha(AVATAR_COLORS[i % AVATAR_COLORS.length], 0.1),
                            color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            display: { xs: "none", sm: "flex" },
                          }}
                        >
                          {org.abbreviation.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap
                            sx={{ fontWeight: 600, color: "primary.main", "&:hover": { textDecoration: "underline" } }}
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
                      <ApiKeyDisplay apiKey={org.apiKey} variant="inline" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {org.courses.map((course) => (
                          <Chip key={course} label={course} size="small"
                            sx={{ borderRadius: "6px", fontWeight: 600, fontSize: "0.65rem", height: 22, bgcolor: alpha("#2563eb", 0.08), color: "#2563eb" }}
                          />
                        ))}
                        {org.courses.length === 0 && (
                          <Typography variant="caption" color="text.secondary">None</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.active ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          borderRadius: "6px", fontWeight: 600, fontSize: "0.7rem", height: 24,
                          bgcolor: org.active ? "#dcfce7" : "#f1f5f9",
                          color: org.active ? "#15803d" : "#64748b",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/organizations/${org.id}`); }}>
                            <EditRoundedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: org.id, name: org.name }); }}>
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
                      <Typography variant="body2" color="text.secondary">No organizations found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>
      <Dialog open={createOpen} onClose={() => { setCreateOpen(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Organization</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 1 }}>
            <OrgFormFields
              values={form}
              onChange={handleFormChange}
              showAbbreviationHelp
              notesRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setCreateOpen(false); resetForm(); }} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!form.name.trim() || !form.abbreviation.trim() || isCreating}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isCreating ? <CircularProgress size={18} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Organization"
        confirmLabel="Delete"
        confirmColor="error"
        isLoading={isDeleting}
      >
        <Typography variant="body2">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </Typography>
      </ConfirmDialog>
    </Box>
  );
}
