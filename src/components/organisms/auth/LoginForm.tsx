"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ComputerIcon from "@mui/icons-material/Computer";
import Link from "next/link";
import { useAuthControllerLoginMutation } from "@/lib/redux/api/generatedApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken } from "@/lib/redux/slices/authSlice";
import { toast } from "react-toastify";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useAuthControllerLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      const result = await login({
        loginDto: { username: username.trim(), password },
      }).unwrap();

      dispatch(setToken(result.access_token));
      toast.success("Logged in successfully");
      onSuccess?.();
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
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: 2,
              }}
            >
              <ComputerIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
              ewiHub Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Enter your credentials to access your dashboard.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <LoginIcon sx={{ mr: 1 }} />
                  Sign In
                </>
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Don&apos;t have an account?
              </Typography>
              <Button
                component={Link}
                href="/auth/signup"
                variant="outlined"
                fullWidth
                sx={{ py: 1.5 }}
              >
                <PersonAddIcon sx={{ mr: 1 }} />
                Create Account
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
