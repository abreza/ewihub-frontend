"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { UIDemographic } from "@/data/employeeAdapter";

const DemographicDisplay = ({ d }: { d: UIDemographic }) => (
  <Box>
    <Typography variant="body2">Age: {d.age}</Typography>
    <Typography variant="body2">Height: {d.height}</Typography>
    <Typography variant="body2">{d.handedness}</Typography>
    <Typography variant="body2">{d.monitors}</Typography>
    {d.usesLaptop && <Typography variant="body2">Uses laptop</Typography>}
    {d.wearsBifocals && <Typography variant="body2">Wears bifocals</Typography>}
    <Typography variant="body2">
      Chair: {d.chairAdjustable ? "Adjustable" : "Not adjustable"}
    </Typography>
  </Box>
);

export default DemographicDisplay;
