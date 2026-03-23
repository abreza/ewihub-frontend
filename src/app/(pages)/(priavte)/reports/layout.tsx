"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/lib/hooks/useMe";
import { useOrganizationControllerFindOneQuery } from "@/lib/redux/api/generatedApi";

const ROUTE_COURSE_MAP: Record<string, string> = {
  "/reports/self-assessment": "Self Assessment",
  "/reports/office-ergonomics": "Office Ergonomics",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: isLoadingUser } = useMe();

  const { data: org, isLoading: isLoadingOrg } = useOrganizationControllerFindOneQuery(
    { id: user?.organization || "" },
    { skip: !user?.organization },
  );

  const isSuperAdmin = user?.role === "superAdmin";

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (isLoadingUser || isLoadingOrg) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={28} thickness={4} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  const requiredCourse = ROUTE_COURSE_MAP[pathname];

  if (requiredCourse && org && !org.courses.includes(requiredCourse)) {
    router.replace("/");
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your organization does not have access to the {requiredCourse} course.
        </Typography>
      </Box>
    );
  }

  if (!org && user && !isSuperAdmin) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
}
