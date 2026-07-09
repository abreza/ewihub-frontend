"use client";

import { useMemo } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { renderMarkdown } from "@/utils/markdown";

interface MarkdownContentProps {
  content: string;
  sx?: SxProps<Theme>;
}

const markdownSx: SxProps<Theme> = {
  fontSize: "0.875rem",
  lineHeight: 1.6,
  color: "text.primary",
  wordBreak: "break-word",
  "& > *:first-of-type": { mt: 0 },
  "& > *:last-child": { mb: 0 },
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    fontWeight: 700,
    lineHeight: 1.3,
    mt: 2,
    mb: 1,
  },
  "& h1": { fontSize: "1.3rem" },
  "& h2": { fontSize: "1.15rem" },
  "& h3": { fontSize: "1rem" },
  "& h4, & h5, & h6": { fontSize: "0.9rem" },
  "& p": { my: 1 },
  "& ul, & ol": { my: 1, pl: 3 },
  "& li": { mb: 0.5 },
  "& a": { color: "primary.main", textDecoration: "underline" },
  "& blockquote": {
    borderLeft: "3px solid",
    borderColor: "divider",
    color: "text.secondary",
    m: 0,
    my: 1,
    pl: 2,
    py: 0.5,
  },
  "& code": {
    fontFamily: "monospace",
    fontSize: "0.82em",
    bgcolor: "action.hover",
    px: 0.6,
    py: 0.2,
    borderRadius: "4px",
  },
  "& pre": {
    bgcolor: "action.hover",
    p: 1.5,
    borderRadius: "8px",
    overflow: "auto",
    my: 1,
  },
  "& pre code": { bgcolor: "transparent", p: 0, fontSize: "0.82em" },
  "& hr": {
    border: "none",
    borderTop: "1px solid",
    borderColor: "divider",
    my: 2,
  },
};

export default function MarkdownContent({ content, sx }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <Box
      sx={{ ...markdownSx, ...sx } as SxProps<Theme>}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
