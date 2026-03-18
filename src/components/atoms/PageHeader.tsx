"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Box
    sx={{
      mb: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{ mb: 0.5, fontSize: { xs: "1.4rem", sm: "2.125rem" } }}
      >
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
    {action}
  </Box>
);

export default PageHeader;
