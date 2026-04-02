"use client";

import { Box, Typography } from "@mui/material";

export interface DemographicData {
  age: string;
  height: string;
  handedness: string;
  monitors: string;
  usesLaptop: boolean;
  chairAdjustable: boolean;
  wearsBifocals: boolean;
}

const DemographicDisplay = ({
  age,
  height,
  handedness,
  monitors,
  usesLaptop,
  wearsBifocals,
  chairAdjustable
}: DemographicData) => (
  <Box>
    <Typography variant="body2">Age: {age}</Typography>
    <Typography variant="body2">Height: {height}</Typography>
    <Typography variant="body2">{handedness}</Typography>
    <Typography variant="body2">{monitors}</Typography>
    {usesLaptop && <Typography variant="body2">Uses laptop</Typography>}
    {wearsBifocals && <Typography variant="body2">Wears bifocals</Typography>}
    <Typography variant="body2">
      Chair: {chairAdjustable ? "Adjustable" : "Not adjustable"}
    </Typography>
  </Box>
);

export default DemographicDisplay;
