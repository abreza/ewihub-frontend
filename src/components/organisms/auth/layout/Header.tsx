"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Breadcrumbs, alpha, Chip } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DRAWER_WIDTH } from "./Sidebar";
import { useMe } from "@/lib/hooks/useMe";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useMe();

  const userInitials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`
    : "?";
  const userLabel = user ? `${user.firstName} ${user.lastName}` : "User";

  const getBreadcrumbItems = (): { label: string; href?: string }[] => {
    const items: { label: string; href?: string }[] = [{ label: "ewiHub", href: "/" }];

    if (pathname === "/") {
      items.push({ label: "Home" });
    } else if (pathname.includes("/reports/office-ergonomics")) {
      items.push({ label: "Reports" });
      items.push({ label: "Office Ergonomics" });
    } else if (pathname.includes("/reports/self-assessment")) {
      items.push({ label: "Reports" });
      items.push({ label: "Self Assessment" });
    } else if (pathname.match(/\/employees\/\d+\/.+/)) {
      items.push({ label: "Employees", href: "/employees" });
      const parts = pathname.split("/");
      const name = parts[parts.length - 1]
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      items.push({ label: name });
    } else if (pathname.includes("/employees")) {
      items.push({ label: "Employees" });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbItems();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: alpha("#fff", 0.85),
        backdropFilter: "blur(12px)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important" }}>
        <IconButton
          onClick={onMenuToggle}
          sx={{
            display: { xs: "flex", md: "none" },
            mr: 1,
            color: "text.primary",
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
            mr: 2,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.65rem" }}>
              ewi
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: DRAWER_WIDTH - 24, flexShrink: 0, display: { xs: "none", md: "block" } }} />
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16, color: "text.secondary" }} />}
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
          }}
        >
          {breadcrumbs.map((item, i) => {
            const isLast = i === breadcrumbs.length - 1;
            if (item.href && !isLast) {
              return (
                <Typography
                  key={i}
                  component={Link}
                  href={item.href}
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": { color: "primary.main" },
                    transition: "color 0.15s",
                  }}
                >
                  {item.label}
                </Typography>
              );
            }
            return (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  color: isLast ? "text.primary" : "text.secondary",
                  fontWeight: isLast ? 600 : 500,
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Breadcrumbs>

        <Box sx={{ flexGrow: 1, display: { xs: "block", sm: "none" } }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              bgcolor: alpha("#000", 0.03),
              "&:hover": { bgcolor: alpha("#000", 0.06) },
            }}
          >
            <NotificationsNoneRoundedIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: "#2563eb", color: "#fff !important", width: 28, height: 28, fontSize: "0.7rem", fontWeight: 700 }}>
                {userInitials}
              </Avatar>
            }
            label={userLabel}
            variant="outlined"
            size="small"
            sx={{
              display: { xs: "none", sm: "flex" },
              borderColor: "divider",
              fontWeight: 500,
              fontSize: "0.8rem",
              height: 34,
              borderRadius: "8px",
              "& .MuiChip-avatar": { ml: 0.25 },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
