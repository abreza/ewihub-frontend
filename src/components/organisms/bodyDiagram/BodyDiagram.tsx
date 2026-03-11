"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography, alpha } from "@mui/material";
import { ZERO_BUCKET, BASE_COLORS, BODY_PARTS } from "./constants";

interface BodyDiagramProps {
  data: Record<string, number>;
  resultLabel: string;
  variant?: "compact" | "full";
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({
  data,
  resultLabel,
  variant = "compact",
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeSpectrum = useMemo(() => {
    if (resultLabel === "COUNT") {
      const values = Object.values(data);
      const maxVal = values.length > 0 ? Math.max(...values) : 0;

      if (maxVal <= 0) {
        return [
          ZERO_BUCKET,
          { min: 1, max: 1, label: "1", ...BASE_COLORS[0] },
          { min: 2, max: 2, label: "2", ...BASE_COLORS[1] },
          { min: 3, max: 3, label: "3", ...BASE_COLORS[2] },
          { min: 4, max: 99999, label: "4+", ...BASE_COLORS[3] },
        ];
      }

      const step = Math.max(1, Math.ceil(maxVal / 4));
      return [
        ZERO_BUCKET,
        { min: 1, max: step, label: `1-${step}`, ...BASE_COLORS[0] },
        { min: step + 1, max: step * 2, label: `${step + 1}-${step * 2}`, ...BASE_COLORS[1] },
        { min: step * 2 + 1, max: step * 3, label: `${step * 2 + 1}-${step * 3}`, ...BASE_COLORS[2] },
        { min: step * 3 + 1, max: 99999, label: `${step * 3 + 1}+`, ...BASE_COLORS[3] },
      ];
    }

    return [
      ZERO_BUCKET,
      { min: 1, max: 2, label: "1-2", ...BASE_COLORS[0] },
      { min: 3, max: 4, label: "3-4", ...BASE_COLORS[1] },
      { min: 5, max: 6, label: "5-6", ...BASE_COLORS[2] },
      { min: 7, max: 99999, label: "7-10", ...BASE_COLORS[3] },
    ];
  }, [data, resultLabel]);

  const getColor = (v: number) => {
    return activeSpectrum.find((s) => v >= s.min && v <= s.max) || activeSpectrum[activeSpectrum.length - 1];
  };

  const getValue = (keys: string[]): number => {
    for (const k of keys) {
      if (data[k] !== undefined && data[k] > 0) return data[k];
    }
    return 0;
  };

  const allZero = Object.values(data).every((v) => v === 0) || Object.keys(data).length === 0;

  let resultColor = "#2563eb";
  if (resultLabel === "PASS") resultColor = "#16a34a";
  else if (resultLabel === "ASSESSMENT") resultColor = "#dc2626";
  else if (resultLabel === "ACTION NEEDED") resultColor = "#ea580c";
  else if (resultLabel === "COUNT") resultColor = "#7c3aed";
  else if (resultLabel === "AVG") resultColor = "#e11d48";

  const isCompact = variant === "compact";
  const width = isCompact ? 220 : 300;
  const height = isCompact ? 340 : 440;

  const hoveredPart = BODY_PARTS.find((p) => p.key.join(",") === hovered);
  const hoveredValue = hoveredPart ? getValue(hoveredPart.key) : 0;
  const hoveredSpectrum = hoveredPart ? getColor(hoveredValue) : activeSpectrum[0];

  let tooltipText = "No Discomfort";
  if (hoveredValue > 0) {
    if (resultLabel === "COUNT") tooltipText = `${hoveredValue} Reports`;
    else if (resultLabel === "AVG") tooltipText = `Avg Level ${hoveredValue}`;
    else tooltipText = `Level ${hoveredValue}`;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        bgcolor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "#e2e8f0",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
      }}
    >
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: `
              radial-gradient(circle at center, ${alpha("#2563eb", 0.03)} 0%, transparent 70%),
              linear-gradient(0deg, transparent 24%, ${alpha("#94a3b8", 0.06)} 25%, ${alpha("#94a3b8", 0.06)} 26%, transparent 27%, transparent 74%, ${alpha("#94a3b8", 0.06)} 75%, ${alpha("#94a3b8", 0.06)} 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, ${alpha("#94a3b8", 0.06)} 25%, ${alpha("#94a3b8", 0.06)} 26%, transparent 27%, transparent 74%, ${alpha("#94a3b8", 0.06)} 75%, ${alpha("#94a3b8", 0.06)} 76%, transparent 77%, transparent)
            `,
            backgroundSize: "100% 100%, 30px 30px, 30px 30px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%",
            width: "220px", height: "220px",
            transform: "translate(-50%, -50%)",
            border: `1px solid ${alpha("#94a3b8", 0.1)}`,
            borderRadius: "50%", pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%",
            width: "320px", height: "320px",
            transform: "translate(-50%, -50%)",
            border: `1px dashed ${alpha("#94a3b8", 0.12)}`,
            borderRadius: "50%", pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute", top: 50, right: 12, zIndex: 10,
            bgcolor: alpha(resultColor, 0.08),
            color: resultColor,
            px: 1.25, py: 0.5,
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: isCompact ? 9 : 11,
            letterSpacing: "0.06em",
            border: `1px solid ${alpha(resultColor, 0.2)}`,
          }}
        >
          {resultLabel}
        </Box>
        {hoveredPart && (
          <Box
            sx={{
              position: "absolute", top: 12, left: 12, zIndex: 10,
              bgcolor: "#ffffff",
              border: `1px solid ${alpha(hoveredSpectrum.light, 0.3)}`,
              borderLeft: `3px solid ${hoveredSpectrum.light}`,
              borderRadius: "6px",
              px: 1.5, py: 1,
              boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)",
              pointerEvents: "none",
            }}
          >
            <Typography sx={{ color: "#64748b", fontSize: isCompact ? 9 : 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.25 }}>
              {hoveredPart.label}
            </Typography>
            <Typography sx={{ color: hoveredSpectrum.text, fontSize: isCompact ? 13 : 15, fontWeight: 800, lineHeight: 1 }}>
              {tooltipText}
            </Typography>
          </Box>
        )}
        <svg
          viewBox="0 0 909.57 1376.26"
          style={{
            width: "100%", height: "100%",
            position: "relative", zIndex: 5,
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.06))",
            marginTop: isCompact ? 4 : 10,
          }}
        >
          <defs>
            {activeSpectrum.map((s, i) => (
              <linearGradient key={`grad-${i}`} id={`grad${i}`} x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor={i === 0 ? "#f8fafc" : s.fill} />
                <stop offset="100%" stopColor={i === 0 ? "#f1f5f9" : alpha(s.light, 0.25)} />
              </linearGradient>
            ))}
            {activeSpectrum.map((s, i) => {
              if (i === 0) return null;
              return (
                <filter key={`glow-${i}`} id={`glow${i}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feFlood floodColor={s.glow} result="color" />
                  <feComposite in2="blur" operator="in" result="shadow" />
                  <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              );
            })}
            <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor="rgba(37, 99, 235, 0.2)" result="color" />
              <feComposite in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g>
            {BODY_PARTS.map((part) => {
              const val = allZero ? 0 : getValue(part.key);
              const spectrum = getColor(val);
              const spectrumIdx = activeSpectrum.findIndex((s) => val >= s.min && val <= s.max);
              const partId = part.key.join(",");

              const isHovered = hovered === partId;
              const isOtherHovered = hovered && hovered !== partId;

              return (
                <g
                  key={partId}
                  onMouseEnter={() => setHovered(partId)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    opacity: isOtherHovered ? 0.35 : 1,
                    transition: "opacity 0.25s ease-in-out",
                  }}
                >
                  <path
                    d={part.d}
                    fill={`url(#grad${spectrumIdx})`}
                    stroke={isHovered ? "#2563eb" : spectrum.border}
                    strokeWidth={isHovered ? 8 : val > 0 ? 5 : 2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={isHovered ? "url(#hoverGlow)" : val > 0 ? `url(#glow${spectrumIdx})` : undefined}
                    style={{ transition: "all 0.25s ease" }}
                  />
                  {!(part.key[0] === "eyes" && val === 0) && (
                    <g transform={`translate(${part.labelPos.x}, ${part.labelPos.y})`}>
                      {val > 0 && (
                        <circle cx="0" cy="0" r={isCompact ? 24 : 28} fill="white" opacity="0.7" />
                      )}
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={val > 0 ? spectrum.text : "#cbd5e1"}
                        fontSize={part.key[0] === "eyes" ? 22 : isCompact ? 30 : 36}
                        fontWeight={val > 0 ? 800 : 600}
                        fontFamily="system-ui, -apple-system, sans-serif"
                        style={{ pointerEvents: "none", userSelect: "none" }}
                      >
                        {val}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5, py: 1.25,
          borderTop: "1px solid",
          borderColor: "#e2e8f0",
          bgcolor: "#f8fafc",
          zIndex: 2,
        }}
      >
        {activeSpectrum.map((s, i) => (
          <Box key={`legend-${i}`} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: isCompact ? 10 : 12, height: isCompact ? 10 : 12,
                borderRadius: "3px",
                background: i === 0 ? "#f1f5f9" : `linear-gradient(135deg, ${s.fill}, ${alpha(s.light, 0.4)})`,
                border: `1px solid ${i === 0 ? "#cbd5e1" : s.border}`,
              }}
            />
            <Typography sx={{ color: "#64748b", fontSize: isCompact ? "0.6rem" : "0.7rem", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BodyDiagram;
