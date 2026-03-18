"use client";

import React from "react";
import {
  TextField, Stack, Box, Chip, FormControlLabel, Switch, Typography,
  FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { COURSE_OPTIONS } from "@/constants";

export interface OrgFormValues {
  name: string;
  abbreviation: string;
  notes: string;
  courses: string[];
  enableDepartments: boolean;
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
    </Box>
  </Stack>
);

export default OrgFormFields;
