"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  alpha,
  CircularProgress,
  Chip,
} from "@mui/material";
import DonutChart, { DonutSegment } from "@/components/organisms/DonutChart";

export interface ChartTab {
  key: string;
  label: string;
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  isLoading?: boolean;
}

interface TabbedDonutChartProps {
  title?: string;
  tabs: ChartTab[];
  defaultTab?: string;
}

const TabbedDonutChart = ({
  title = "Result Summary",
  tabs,
  defaultTab,
}: TabbedDonutChartProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || "");

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  if (!currentTab) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="small"
              variant="contained"
              onClick={() => setActiveTab(tab.key)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                px: { xs: 1, sm: 1.5 },
                py: 0.5,
                minWidth: 0,
                borderRadius: "6px",
                bgcolor:
                  activeTab === tab.key
                    ? "primary.main"
                    : alpha("#64748b", 0.08),
                color:
                  activeTab === tab.key ? "white" : "text.secondary",
                "&:hover": {
                  bgcolor:
                    activeTab === tab.key
                      ? "primary.dark"
                      : alpha("#64748b", 0.12),
                },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: 240, md: 280 },
        }}
      >
        {currentTab.isLoading ? (
          <CircularProgress size={28} />
        ) : currentTab.segments.length === 0 ||
          currentTab.segments.every((s) => s.value === 0) ? (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        ) : (
          <DonutChart
            segments={currentTab.segments}
            centerValue={currentTab.centerValue}
            centerLabel={currentTab.centerLabel}
          />
        )}
      </Box>
    </Box>
  );
};

export default TabbedDonutChart;
