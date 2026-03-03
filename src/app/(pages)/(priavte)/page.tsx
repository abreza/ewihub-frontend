"use client";

import { useMemo } from "react";
import { Box, Card, CardContent, Typography, Grid, alpha, LinearProgress } from "@mui/material";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/navigation";
import { getProgramStats } from "@/data/employeeAdapter";

export default function HomePage() {
  const router = useRouter();
  const stats = useMemo(() => getProgramStats(), []);

  const metrics = [
    {
      title: "Office Ergonomics",
      description: "Workspace setup training & compliance",
      icon: <ChairAltIcon sx={{ fontSize: 28 }} />,
      stats: { enrolled: stats.oe.enrolled, completed: stats.oe.completed, inProgress: stats.oe.inProgress },
      link: "/reports/office-ergonomics",
      gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
      iconBg: alpha("#3b82f6", 0.12),
      iconColor: "#2563eb",
    },
    {
      title: "Self Assessment",
      description: "Employee ergonomic self-evaluations",
      icon: <AccessibilityNewIcon sx={{ fontSize: 28 }} />,
      stats: { enrolled: stats.sa.enrolled, completed: stats.sa.completed, inProgress: stats.sa.inProgress },
      link: "/reports/self-assessment",
      gradient: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
      iconBg: alpha("#10b981", 0.12),
      iconColor: "#059669",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5, color: "text.primary", fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your ergonomics program performance
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {[
          { label: "Total Employees", value: String(stats.totalEmployees), icon: <GroupsIcon />, color: "#2563eb" },
          { label: "Completion Rate", value: `${stats.completionRate}%`, icon: <TrendingUpIcon />, color: "#16a34a" },
          { label: "Assessments Due", value: String(stats.assessmentsDue), icon: <AccessibilityNewIcon />, color: "#ea580c" },
          { label: "Avg. Days to Complete", value: "1", icon: <ChairAltIcon />, color: "#7c3aed" },
        ].map((stat, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card
              sx={{
                "&:hover": { borderColor: alpha(stat.color, 0.3) },
                transition: "all 0.2s ease",
              }}
            >
              <CardContent sx={{ p: { xs: "12px !important", sm: "16px !important" } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
                  <Box
                    sx={{
                      width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 }, borderRadius: "10px",
                      bgcolor: alpha(stat.color, 0.08),
                      color: stat.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      "& svg": { fontSize: { xs: "1.1rem", sm: "1.3rem" } },
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ lineHeight: 1.1, fontSize: { xs: "1.1rem", sm: "1.5rem" } }}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "none", letterSpacing: 0, fontSize: { xs: "0.65rem", sm: "0.75rem" } }} noWrap>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {metrics.map((module, idx) => {
          const completionRate = module.stats.enrolled > 0
            ? Math.round((module.stats.completed / module.stats.enrolled) * 100)
            : 0;
          return (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.06)",
                    borderColor: "transparent",
                  },
                }}
                onClick={() => router.push(module.link)}
              >
                <CardContent sx={{ p: { xs: "16px !important", sm: "24px !important" } }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 0.25, fontSize: { xs: "0.95rem", sm: "1.25rem" } }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: "12px",
                        bgcolor: module.iconBg, color: module.iconColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        ml: 1.5,
                      }}
                    >
                      {module.icon}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                      <Typography variant="caption" color="text.secondary">Completion</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: module.iconColor }}>
                        {completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={completionRate}
                      sx={{
                        height: 6, borderRadius: 3,
                        bgcolor: alpha(module.iconColor, 0.08),
                        "& .MuiLinearProgress-bar": { borderRadius: 3, background: module.gradient },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[
                      { label: "Enrolled", value: module.stats.enrolled, color: "text.primary" },
                      { label: "Completed", value: module.stats.completed, color: "#16a34a" },
                      { label: "In Progress", value: module.stats.inProgress, color: "#ea580c" },
                    ].map((stat, si) => (
                      <Box
                        key={si}
                        sx={{
                          flex: 1, textAlign: "center", py: { xs: 0.75, sm: 1.25 },
                          borderRadius: "8px", bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" }, color: stat.color, lineHeight: 1.2 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.65rem" }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
