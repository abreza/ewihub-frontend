"use client";

import { useState, useCallback } from "react";

export type SortableField = "name" | "email" | "createdAt" | "updatedAt";

interface UsePaginatedTableOptions {
  defaultSortBy?: SortableField;
  defaultSortOrder?: "asc" | "desc";
  defaultPageSize?: number;
}

export function usePaginatedTable(options: UsePaginatedTableOptions = {}) {
  const {
    defaultSortBy = "createdAt",
    defaultSortOrder = "desc",
    defaultPageSize = 5,
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortBy, setSortBy] = useState<SortableField>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);

  const handleSort = useCallback(
    (field: SortableField) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder(
          field === "name" || field === "email" ? "asc" : "desc",
        );
      }
      setPage(1);
    },
    [sortBy],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    sortBy,
    sortOrder,
    handleSort,
  };
}
