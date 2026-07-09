"use client";

import { useCallback, useRef, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import MarkdownContent from "./MarkdownContent";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  autoFocus?: boolean;
}

type Command =
  | { kind: "wrap"; before: string; after: string; placeholder: string }
  | { kind: "prefix"; prefix: string; placeholder: string };

interface Tool {
  key: string;
  title: string;
  icon: React.ReactNode;
  command: Command;
}

// Pure data — no refs or component state — so the toolbar map below never
// touches a ref during render (keeps react-hooks/refs happy).
const TOOLS: Tool[] = [
  {
    key: "bold",
    title: "Bold",
    icon: <FormatBoldRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "wrap", before: "**", after: "**", placeholder: "bold text" },
  },
  {
    key: "italic",
    title: "Italic",
    icon: <FormatItalicRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "wrap", before: "_", after: "_", placeholder: "italic text" },
  },
  {
    key: "heading",
    title: "Heading",
    icon: <TitleRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "prefix", prefix: "## ", placeholder: "Heading" },
  },
  {
    key: "ul",
    title: "Bulleted list",
    icon: <FormatListBulletedRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "prefix", prefix: "- ", placeholder: "List item" },
  },
  {
    key: "ol",
    title: "Numbered list",
    icon: <FormatListNumberedRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "prefix", prefix: "1. ", placeholder: "List item" },
  },
  {
    key: "quote",
    title: "Quote",
    icon: <FormatQuoteRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "prefix", prefix: "> ", placeholder: "Quote" },
  },
  {
    key: "code",
    title: "Inline code",
    icon: <CodeRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "wrap", before: "`", after: "`", placeholder: "code" },
  },
  {
    key: "link",
    title: "Link",
    icon: <LinkRoundedIcon sx={{ fontSize: 18 }} />,
    command: { kind: "wrap", before: "[", after: "](https://)", placeholder: "link text" },
  },
];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write a note using Markdown…",
  minRows = 6,
  autoFocus = false,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<0 | 1>(0);

  // The single place a ref is read; only ever called from a click handler.
  const applyCommand = useCallback(
    (command: Command) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;

      if (command.kind === "wrap") {
        const selected = value.slice(start, end) || command.placeholder;
        const next =
          value.slice(0, start) +
          command.before +
          selected +
          command.after +
          value.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
          el.focus();
          el.selectionStart = start + command.before.length;
          el.selectionEnd = start + command.before.length + selected.length;
        });
        return;
      }

      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end) || command.placeholder;
      const prefixed = block
        .split("\n")
        .map((line) => `${command.prefix}${line}`)
        .join("\n");
      const next = value.slice(0, lineStart) + prefixed + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.selectionStart = lineStart;
        el.selectionEnd = lineStart + prefixed.length;
      });
    },
    [value, onChange],
  );

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
          flexWrap: "wrap",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              minHeight: 40,
              minWidth: "auto",
              px: 1.5,
            },
          }}
        >
          <Tab label="Write" />
          <Tab label="Preview" />
        </Tabs>

        {tab === 0 && (
          <ToggleButtonGroup size="small" sx={{ my: 0.5 }}>
            {TOOLS.map((tool) => (
              <Tooltip key={tool.key} title={tool.title}>
                <ToggleButton
                  value={tool.key}
                  onClick={() => applyCommand(tool.command)}
                  sx={{ border: "none", px: 0.9, py: 0.4 }}
                >
                  {tool.icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>

      {tab === 0 ? (
        <Box
          component="textarea"
          ref={textareaRef}
          value={value}
          autoFocus={autoFocus}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          sx={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "vertical",
            p: 1.5,
            fontFamily: "inherit",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "text.primary",
            bgcolor: "background.paper",
            display: "block",
            boxSizing: "border-box",
            "&::placeholder": { color: "text.disabled" },
          }}
        />
      ) : (
        <Box sx={{ p: 1.5, minHeight: minRows * 24 }}>
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <Typography variant="body2" color="text.disabled">
              Nothing to preview yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
