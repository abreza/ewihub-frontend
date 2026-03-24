"use client";

import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

export interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  legendValueType?: "count" | "percentage";
}

const RADIUS = 15.9155;

const DonutChart = ({
  segments,
  centerValue,
  centerLabel,
  legendValueType = "count",
}: DonutChartProps) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const arcs = useMemo(() => {
    if (total === 0) return [];
    let running = 0;
    return segments.map((seg) => {
      const pct = (seg.value / total) * 100;
      const offset = -running;
      running += pct;
      return { ...seg, pct, offset };
    });
  }, [segments, total]);

  if (total === 0) return null;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: { xs: 180, sm: 240 },
          height: { xs: 180, sm: 240 },
          margin: "0 auto",
        }}
      >
        <svg
          viewBox="0 0 36 36"
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
        >
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="3.5"
          />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth="3.5"
              strokeDasharray={`${arc.pct} ${100 - arc.pct}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1,
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
            }}
          >
            {centerValue}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
            {centerLabel}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1.5, sm: 2 },
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {segments.map((seg, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: seg.color,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.825rem" } }}
            >
              {seg.label} ({legendValueType === "percentage" ? `${Math.round((seg.value / total) * 100)}%` : seg.value})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DonutChart;
