"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useAuthControllerGetProfileQuery } from "@/lib/redux/api/generatedApi";

export function useMe() {
  const token = useAppSelector((state) => state.auth.token);
  const isDemo = token === "fake-demo-token";

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthControllerGetProfileQuery(undefined, {
    skip: !token || isDemo,
  });

  const demoUser = {
    id: "demo-123",
    firstName: "Demo",
    lastName: "User",
    email: "demo@ewihub.com",
    username: "demo",
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const currentUser = isDemo ? demoUser : user;

  const isAuthenticated = !!token && (isDemo || (!!user && !isError));

  return {
    user: currentUser,
    isLoading: token && !isDemo ? isLoading : false,
    isError: isDemo ? false : isError,
    error: isDemo ? undefined : error,
    isAuthenticated,
    refetch,
  };
}
