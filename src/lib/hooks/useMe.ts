"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useAuthControllerGetProfileQuery } from "@/lib/redux/api/generatedApi";

export function useMe() {
  const token = useAppSelector((state) => state.auth.token);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthControllerGetProfileQuery(undefined, {
    skip: !token,
  });

  const isAuthenticated = !!token && !!user && !isError;

  return {
    user,
    isLoading: !!token && isLoading,
    isError,
    error,
    isAuthenticated,
    refetch,
  };
}
