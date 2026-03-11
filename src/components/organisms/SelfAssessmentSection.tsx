"use client";

import { Box, Card, Chip, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { UIEmployeeDetail } from "@/data/employeeAdapter";
import DetailRow from "@/components/molecules/DetailRow";
import DemographicDisplay from "@/components/molecules/DemographicDisplay";
import BodyDiagram from "@/components/organisms/bodyDiagram/BodyDiagram";

const SelfAssessmentSection = ({ detail, resultLabel }: { detail: NonNullable<UIEmployeeDetail["selfAssessmentDetail"]>; resultLabel: string }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>Self Assessment Details</Typography>
    <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexWrap: "wrap" }}>
      <Card sx={{ flex: 1, minWidth: { xs: "100%", sm: 300 } }}>
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <DetailRow label="Started" value={detail.started} icon={<AccessTimeIcon />} />
          <DetailRow label="Completed" value={detail.completed} icon={<AccessTimeIcon />} />
          <DetailRow label="Demographic" value={<DemographicDisplay d={detail.demographic} />} />
          <DetailRow label="Discomforts" value={detail.discomforts} />
          <DetailRow label="Action" value={detail.action} />
          <DetailRow label="Equipment" value={detail.equipment} />
          <DetailRow label="Issues" value={detail.issues} />
          <DetailRow
            label="Result"
            value={
              <Chip
                label={detail.result}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  bgcolor: detail.result === "Success" ? "#dcfce7" : "#fee2e2",
                  color: detail.result === "Success" ? "#15803d" : "#b91c1c",
                  borderRadius: "6px",
                }}
              />
            }
          />
        </Box>
      </Card>
      <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center", alignItems: "flex-start" }}>
        <BodyDiagram data={detail.bodyData} resultLabel={resultLabel} />
      </Box>
    </Box>
  </Box>
);

export default SelfAssessmentSection;
