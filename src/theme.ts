"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f172a",
      light: "#334155",
      contrastText: "#ffffff",
    },
    success: {
      main: "#16a34a",
      light: "#bbf7d0",
      dark: "#15803d",
    },
    warning: {
      main: "#ea580c",
      light: "#fed7aa",
      dark: "#c2410c",
    },
    error: {
      main: "#dc2626",
      light: "#fecaca",
      dark: "#b91c1c",
    },
    info: {
      main: "#0891b2",
      light: "#cffafe",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h5: { fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 },
    h6: { fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.4 },
    subtitle1: { fontWeight: 600, fontSize: "0.95rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.02em" },
    body1: { fontSize: "0.9rem", lineHeight: 1.6 },
    body2: { fontSize: "0.825rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.04em" },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@import": "url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap')",
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.825rem",
          padding: "6px 16px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        contained: {
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "&:hover": {
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#e2e8f0",
          color: "#334155",
          "&:hover": {
            borderColor: "#cbd5e1",
            backgroundColor: "#f8fafc",
          },
        },
        sizeSmall: {
          padding: "4px 12px",
          fontSize: "0.775rem",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          overflow: "hidden",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.03em",
        },
        sizeSmall: {
          height: 22,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#f1f5f9",
          padding: "10px 16px",
          fontSize: "0.825rem",
        },
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#64748b",
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&.MuiTableRow-hover:hover": { backgroundColor: "#f8fafc" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontSize: "0.875rem",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#cbd5e1" },
            "&.Mui-focused fieldset": { borderWidth: 1.5 },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#f1f5f9" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0",
        },
      },
    },
  },
});

export default theme;
