"use client";

import React from "react";
import {
  TextField, Stack, Box, Chip, FormControlLabel, Switch, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Button,
} from "@mui/material";
import { COURSE_OPTIONS, DEFAULT_FOLLOW_UP_STATUSES } from "@/constants";

export interface OrgFormValues {
  name: string;
  abbreviation: string;
  notes: string;
  courses: string[];
  enableDepartments: boolean;
  enableFollowUpStatus: boolean;
  followUpStatuses: string[];
  active: boolean;
}

interface OrgFormFieldsProps {
  values: OrgFormValues;
  onChange: <K extends keyof OrgFormValues>(field: K, value: OrgFormValues[K]) => void;
  showAbbreviationHelp?: boolean;
  notesRows?: number;
}

const OrgFormFields = ({
  values,
  onChange,
  showAbbreviationHelp = false,
  notesRows = 3,
}: OrgFormFieldsProps) => (
  <Stack spacing={2.5}>
    <TextField
      label="Organization Name"
      value={values.name}
      onChange={(e) => onChange("name", e.target.value)}
      fullWidth
      required
      size="small"
    />
    <TextField
      label="Abbreviation"
      value={values.abbreviation}
      onChange={(e) => onChange("abbreviation", e.target.value)}
      fullWidth
      required
      size="small"
      helperText={showAbbreviationHelp ? "Short identifier for the organization" : undefined}
    />
    <TextField
      label="Notes"
      value={values.notes}
      onChange={(e) => onChange("notes", e.target.value)}
      fullWidth
      multiline
      rows={notesRows}
      size="small"
    />
    <FormControl size="small" fullWidth>
      <InputLabel>Courses</InputLabel>
      <Select
        multiple
        value={values.courses}
        onChange={(e) => onChange("courses", e.target.value as string[])}
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
            checked={values.enableDepartments}
            onChange={(e) => onChange("enableDepartments", e.target.checked)}
            size="small"
          />
        }
        label={<Typography variant="body2">Enable Departments</Typography>}
      />
      <FormControlLabel
        control={
          <Switch
            checked={values.active}
            onChange={(e) => onChange("active", e.target.checked)}
            size="small"
          />
        }
        label={<Typography variant="body2">Active</Typography>}
      />
      <FormControlLabel
        control={
          <Switch
            checked={values.enableFollowUpStatus}
            onChange={(e) => onChange("enableFollowUpStatus", e.target.checked)}
            size="small"
          />
        }
        label={<Typography variant="body2">Enable Follow-Up Status</Typography>}
      />

      {values.enableFollowUpStatus && (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
            Follow-Up Status Options
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
            {values.followUpStatuses.map((status, i) => (
              <Chip
                key={i}
                label={status}
                size="small"
                onDelete={() => {
                  const updated = values.followUpStatuses.filter((_, idx) => idx !== i);
                  onChange("followUpStatuses", updated);
                }}
                sx={{ borderRadius: "6px", fontWeight: 500, fontSize: "0.75rem" }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Add new status..."
              id="new-follow-up-status"
              sx={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !values.followUpStatuses.includes(val)) {
                    onChange("followUpStatuses", [...values.followUpStatuses, val]);
                    input.value = "";
                  }
                }
              }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => onChange("followUpStatuses", [...DEFAULT_FOLLOW_UP_STATUSES])}
              sx={{ textTransform: "none", fontSize: "0.75rem", whiteSpace: "nowrap" }}
            >
              Reset to Defaults
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  </Stack>
);

export default OrgFormFields;
