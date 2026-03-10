"use client";

import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment, IconButton, alpha
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthControllerLoginMutation } from "@/lib/redux/api/generatedApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken } from "@/lib/redux/slices/authSlice";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useAuthControllerLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      const result = await login({ loginDto: { username: username.trim(), password } }).unwrap();
      dispatch(setToken(result.access_token));
      toast.success("Logged in successfully");
      router.replace("/");
    } catch (err) {
      const error = err as { status?: number; data?: { message?: string } };
      if (error.status === 401) {
        setError("Invalid username or password");
        toast.error("Invalid username or password");
      } else if (error.data?.message) {
        setError(error.data.message);
        toast.error(error.data.message);
      } else {
        setError("Server connection error");
        toast.error("Server connection error");
      }
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#0f172a",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background pattern */}
      <Box sx={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle at 25px 25px, white 1px, transparent 0)",
        backgroundSize: "50px 50px",
      }} />
      {/* Gradient blobs */}
      <Box sx={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        top: "-20%", right: "-10%",
      }} />
      <Box sx={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)",
        bottom: "-10%", left: "-5%",
      }} />

      <Card sx={{
        maxWidth: 420, width: "100%", mx: 2,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: alpha("#fff", 0.08),
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)",
        position: "relative",
        zIndex: 1,
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px",
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mb: 2, boxShadow: "0 4px 12px rgb(22 163 74 / 0.3)",
            }}>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>ewi</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sign in to your ewiHub dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block", color: "text.secondary" }}>
              Username
            </Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Enter your username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading} sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block", color: "text.secondary" }}>
              Password
            </Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: "1.1rem" }} /> : <VisibilityIcon sx={{ fontSize: "1.1rem" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit" fullWidth variant="contained" color="primary"
              disabled={isLoading}
              sx={{
                py: 1.35, fontSize: "0.9rem", fontWeight: 600,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow: "0 4px 12px rgb(37 99 235 / 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgb(37 99 235 / 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  Sign In
                  <ArrowForwardIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
                <Typography
                  component={Link} href="/auth/signup" variant="body2"
                  sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Create account
                </Typography>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
