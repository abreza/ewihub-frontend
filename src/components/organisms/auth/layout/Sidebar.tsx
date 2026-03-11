"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  alpha,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/lib/hooks/useMe";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { emptyApi } from "@/lib/redux/api/emptyApi";

export const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [reportsOpen, setReportsOpen] = useState(pathname.includes("/reports"));

  const { user } = useMe();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(emptyApi.util.resetApiState());
    router.replace("/auth/login");
  };

  const userInitials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`
    : "?";
  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userEmail = user?.email ?? "";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "/employees") return pathname.startsWith("/employees");
    if (path === "/organizations") return pathname.startsWith("/organizations");
    return pathname === path;
  };

  const navItems = [
    { label: "Home", icon: <HomeRoundedIcon />, path: "/" },
    {
      label: "Reports",
      icon: <BarChartRoundedIcon />,
      children: [
        { label: "Self Assessment", path: "/reports/self-assessment" },
        { label: "Office Ergonomics", path: "/reports/office-ergonomics" },
      ],
    },
    { label: "Employees", icon: <PeopleRoundedIcon />, path: "/employees" },
    ...(user?.role === "superAdmin"
      ? [{ label: "Organizations", icon: <BusinessRoundedIcon />, path: "/organizations" }]
      : []),
  ];

  const activeColor = "#2563eb";
  const activeBg = alpha(activeColor, 0.08);
  const hoverBg = alpha("#fff", 0.04);

  const handleNavigate = (path: string) => {
    router.push(path);
    if (isMobile) onMobileClose();
  };

  const drawerContent = (
    <>
      <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "-0.02em" }}>
            ewi
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#f8fafc", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            ewiHub
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Ergonomics Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.06), mx: 2 }} />

      <Box sx={{ px: 1.5, pt: 2 }}>
        <Typography sx={{ px: 1.5, mb: 1, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1.5, pt: 0 }}>
        {navItems.map((item) => {
          if (item.children) {
            const isParentActive = pathname.includes("/reports");
            return (
              <React.Fragment key={item.label}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => setReportsOpen(!reportsOpen)}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.5,
                      bgcolor: isParentActive ? activeBg : "transparent",
                      color: isParentActive ? activeColor : "#94a3b8",
                      "&:hover": { bgcolor: isParentActive ? activeBg : hoverBg },
                      transition: "all 0.15s ease",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36, "& svg": { fontSize: "1.25rem" } }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: isParentActive ? 600 : 500 }}
                    />
                    {reportsOpen ? <ExpandLess sx={{ fontSize: "1.1rem" }} /> : <ExpandMore sx={{ fontSize: "1.1rem" }} />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 1 }}>
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <ListItemButton
                          key={child.label}
                          sx={{
                            borderRadius: "8px",
                            py: 0.75,
                            pl: 4.5,
                            mb: 0.25,
                            color: isChildActive ? activeColor : "#94a3b8",
                            bgcolor: isChildActive ? activeBg : "transparent",
                            "&:hover": { bgcolor: isChildActive ? activeBg : hoverBg },
                            transition: "all 0.15s ease",
                          }}
                          onClick={() => handleNavigate(child.path)}
                        >
                          <ListItemIcon sx={{ color: "inherit", minWidth: 24 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 6 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: isChildActive ? 600 : 400 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          const active = isActive(item.path!);
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path!)}
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  px: 1.5,
                  bgcolor: active ? activeBg : "transparent",
                  color: active ? activeColor : "#94a3b8",
                  "&:hover": { bgcolor: active ? activeBg : hoverBg },
                  transition: "all 0.15s ease",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36, "& svg": { fontSize: "1.25rem" } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", px: 1.5, pb: 2 }}>
        <Divider sx={{ borderColor: alpha("#fff", 0.06), mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            bgcolor: alpha("#fff", 0.03),
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: alpha("#2563eb", 0.15),
              color: "#60a5fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            {userInitials}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }} noWrap>
              {userDisplayName}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#64748b", lineHeight: 1.3 }} noWrap>
              {userEmail}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: "#64748b", "&:hover": { color: "#f87171" } }}
          >
            <LogoutRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            color: "#94a3b8",
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            color: "#94a3b8",
            borderRight: "none",
            overflowX: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
