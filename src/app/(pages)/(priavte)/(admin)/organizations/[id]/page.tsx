/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Chip,
  alpha, IconButton, Tooltip, Switch, FormControlLabel, Stack, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, FormControl, InputLabel, Select, MenuItem, Alert,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopy";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import { useParams, useRouter } from "next/navigation";
import {
  useOrganizationControllerFindOneQuery,
  useOrganizationControllerUpdateMutation,
  useOrganizationControllerRemoveMutation,
  useOrganizationControllerRegenerateApiKeyMutation,
  useOrganizationControllerGetUsersQuery,
  useOrganizationControllerAddUserMutation,
  useOrganizationControllerRemoveUserMutation,
  useOrganizationControllerSyncFromEwihubMutation,
} from "@/lib/redux/api/generatedApi";

const COURSE_OPTIONS = ["Office Ergonomics", "Self Assessment"];

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.id as string;

  const { data: org, isLoading, error } = useOrganizationControllerFindOneQuery(
    { id: orgId },
    { skip: !orgId }
  );
  const { data: users, isLoading: isLoadingUsers } = useOrganizationControllerGetUsersQuery(
    { id: orgId },
    { skip: !orgId }
  );

  const [updateOrg, { isLoading: isUpdating }] = useOrganizationControllerUpdateMutation();
  const [removeOrg] = useOrganizationControllerRemoveMutation();
  const [regenerateKey, { isLoading: isRegenerating }] = useOrganizationControllerRegenerateApiKeyMutation();
  const [addUser, { isLoading: isAddingUser }] = useOrganizationControllerAddUserMutation();
  const [removeUser, { isLoading: isRemovingUser }] = useOrganizationControllerRemoveUserMutation();
  const [syncEwihub, { isLoading: isSyncing }] = useOrganizationControllerSyncFromEwihubMutation();

  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [notes, setNotes] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [enableDepartments, setEnableDepartments] = useState(false);
  const [active, setActive] = useState(true);

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<{ id: string; name: string } | null>(null);
  const [regenConfirmOpen, setRegenConfirmOpen] = useState(false);
  const [deleteOrgOpen, setDeleteOrgOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncEmail, setSyncEmail] = useState("");
  const [syncPassword, setSyncPassword] = useState("");
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    totalScraped: number;
    created: number;
    updated: number;
    errors: string[];
  } | null>(null);

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    if (org) {
      setName(org.name);
      setAbbreviation(org.abbreviation);
      setNotes(org.notes || "");
      setCourses(org.courses);
      setEnableDepartments(org.enableDepartments);
      setActive(org.active);
    }
  }, [org]);

  const hasChanges = useMemo(() => {
    if (!org) return false;
    return (
      name !== org.name ||
      abbreviation !== org.abbreviation ||
      notes !== (org.notes || "") ||
      JSON.stringify(courses) !== JSON.stringify(org.courses) ||
      enableDepartments !== org.enableDepartments ||
      active !== org.active
    );
  }, [name, abbreviation, notes, courses, enableDepartments, active, org]);

  const handleSave = async () => {
    try {
      await updateOrg({
        id: orgId,
        updateOrganizationDto: {
          name,
          abbreviation,
          notes: notes || undefined,
          courses,
          enableDepartments,
          active,
        },
      }).unwrap();
      setSuccessMsg("Organization updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to update organization:", err);
    }
  };

  const handleRegenerateKey = async () => {
    try {
      await regenerateKey({ id: orgId }).unwrap();
      setRegenConfirmOpen(false);
      setSuccessMsg("API key regenerated");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to regenerate API key:", err);
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser({
        id: orgId,
        addOrgUserDto: {
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
          username: userUsername,
          password: userPassword,
        },
      }).unwrap();
      setAddUserOpen(false);
      resetUserForm();
      setSuccessMsg("User added successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    try {
      await removeUser({ id: orgId, userId: deleteUserTarget.id }).unwrap();
      setDeleteUserTarget(null);
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  const handleSync = async () => {
    try {
      const result = await syncEwihub({
        id: orgId,
        syncEwihubDto: { email: syncEmail, password: syncPassword },
      }).unwrap();
      setSyncResult(result);
      setSyncEmail("");
      setSyncPassword("");
      setSuccessMsg(`Sync complete: ${result.created} created, ${result.updated} updated`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Failed to sync from EWI Hub:", err);
    }
  };

  const handleDeleteOrg = async () => {
    try {
      await removeOrg({ id: orgId }).unwrap();
      router.push("/organizations");
    } catch (err) {
      console.error("Failed to delete organization:", err);
    }
  };

  const resetUserForm = () => {
    setUserFirstName("");
    setUserLastName("");
    setUserEmail("");
    setUserUsername("");
    setUserPassword("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error || !org) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Organization not found
        </Typography>
        <Button onClick={() => router.push("/organizations")} sx={{ mt: 2, textTransform: "none" }}>
          Back to Organizations
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton onClick={() => router.push("/organizations")} size="small">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>
            {org.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {org.abbreviation} · Created {new Date(org.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Chip
          label={org.active ? "Active" : "Inactive"}
          size="small"
          sx={{
            borderRadius: "6px",
            fontWeight: 600,
            bgcolor: org.active ? "#dcfce7" : "#f1f5f9",
            color: org.active ? "#15803d" : "#64748b",
          }}
        />
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
                Organization Details
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                  required
                />
                <TextField
                  label="Abbreviation"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  fullWidth
                  size="small"
                  required
                />
                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Courses</InputLabel>
                  <Select
                    multiple
                    value={courses}
                    onChange={(e) => setCourses(e.target.value as string[])}
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
                <Box sx={{ display: "flex", gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableDepartments}
                        onChange={(e) => setEnableDepartments(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Enable Departments</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Active</Typography>}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={isUpdating ? <CircularProgress size={16} /> : <SaveRoundedIcon />}
                    onClick={handleSave}
                    disabled={!hasChanges || isUpdating || !name.trim() || !abbreviation.trim()}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  EWI Hub Sync
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Import employee data from ewihub.com using organization credentials.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isSyncing ? <CircularProgress size={14} /> : <SyncRoundedIcon />}
                  onClick={() => setSyncOpen(true)}
                  disabled={isSyncing}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Sync from EWI Hub
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  API Key
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    bgcolor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {org.apiKey}
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton size="small" onClick={() => copyToClipboard(org.apiKey)}>
                      <ContentCopyRoundedIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isRegenerating ? <CircularProgress size={14} /> : <RefreshRoundedIcon />}
                  onClick={() => setRegenConfirmOpen(true)}
                  disabled
                  sx={{ mt: 1.5, textTransform: "none", fontWeight: 600 }}
                >
                  Regenerate Key
                </Button>
              </CardContent>
            </Card>

            {org.departments && org.departments.length > 0 && (
              <Card>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Departments
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                    {org.departments.map((dept) => (
                      <Chip
                        key={dept}
                        label={dept}
                        size="small"
                        sx={{
                          borderRadius: "6px",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          bgcolor: alpha("#7c3aed", 0.08),
                          color: "#7c3aed",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Card sx={{ border: "1px solid", borderColor: alpha("#dc2626", 0.2) }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#dc2626" }}>
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Permanently delete this organization and all associated data.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={() => setDeleteOrgOpen(true)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Delete Organization
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Users ({users?.length ?? 0})
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() => setAddUserOpen(true)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add User
              </Button>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ overflow: "auto" }}>
              {isLoadingUsers ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            sx={{
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "0.65rem",
                              height: 22,
                              bgcolor: user.role === "superAdmin" ? alpha("#7c3aed", 0.1) : alpha("#2563eb", 0.08),
                              color: user.role === "superAdmin" ? "#7c3aed" : "#2563eb",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Remove user">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                setDeleteUserTarget({
                                  id: user.id,
                                  name: `${user.firstName} ${user.lastName}`,
                                })
                              }
                            >
                              <DeleteRoundedIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No users assigned to this organization
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={addUserOpen}
        onClose={() => { setAddUserOpen(false); resetUserForm(); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                fullWidth
                required
                size="small"
              />
              <TextField
                label="Last Name"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                fullWidth
                required
                size="small"
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Username"
              value={userUsername}
              onChange={(e) => setUserUsername(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              fullWidth
              required
              size="small"
              helperText="Min 8 characters, must include letter and number"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setAddUserOpen(false); resetUserForm(); }} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={
              !userFirstName.trim() ||
              !userLastName.trim() ||
              !userEmail.trim() ||
              !userUsername.trim() ||
              !userPassword.trim() ||
              isAddingUser
            }
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isAddingUser ? <CircularProgress size={18} /> : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteUserTarget} onClose={() => setDeleteUserTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove User</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Remove <strong>{deleteUserTarget?.name}</strong> from this organization?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteUserTarget(null)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            disabled={isRemovingUser}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isRemovingUser ? <CircularProgress size={18} /> : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={regenConfirmOpen} onClose={() => setRegenConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Regenerate API Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will invalidate the current API key. Any integrations using the old key will stop working.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRegenConfirmOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleRegenerateKey}
            disabled={isRegenerating}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isRegenerating ? <CircularProgress size={18} /> : "Regenerate"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={syncOpen}
        onClose={() => {
          if (!isSyncing) {
            setSyncOpen(false);
            setSyncEmail("");
            setSyncPassword("");
            setSyncResult(null);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Sync from EWI Hub</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter EWI Hub credentials for this organization. Employee profiles will be
            scraped and synced into the system.
          </Typography>
          {syncResult && (
            <Alert
              severity={syncResult.success ? "success" : "error"}
              sx={{ mb: 2 }}
              onClose={() => setSyncResult(null)}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {syncResult.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Scraped: {syncResult.totalScraped} · Created: {syncResult.created} · Updated: {syncResult.updated}
                {syncResult.errors.length > 0 && ` · Errors: ${syncResult.errors.length}`}
              </Typography>
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="EWI Hub Email"
              type="email"
              value={syncEmail}
              onChange={(e) => setSyncEmail(e.target.value)}
              fullWidth
              required
              size="small"
              disabled={isSyncing}
            />
            <TextField
              label="EWI Hub Password"
              type="password"
              value={syncPassword}
              onChange={(e) => setSyncPassword(e.target.value)}
              fullWidth
              required
              size="small"
              disabled={isSyncing}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setSyncOpen(false);
              setSyncEmail("");
              setSyncPassword("");
              setSyncResult(null);
            }}
            disabled={isSyncing}
            sx={{ textTransform: "none" }}
          >
            {syncResult ? "Close" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            onClick={handleSync}
            disabled={!syncEmail.trim() || !syncPassword.trim() || isSyncing}
            startIcon={isSyncing ? <CircularProgress size={16} /> : <SyncRoundedIcon />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isSyncing ? "Syncing..." : "Start Sync"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOrgOpen} onClose={() => setDeleteOrgOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>Delete Organization</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to permanently delete <strong>{org.name}</strong>? This will remove all associated employees, trainings, and users.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOrgOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteOrg}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
