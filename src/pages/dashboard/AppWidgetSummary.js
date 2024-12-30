import { Card, Typography, Box } from "@mui/material";

export default function AppWidgetSummary({ title, total, icon, color, subtitle }) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: `${color}.light`,
      }}
    >
      <Box>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ fontWeight: "bold" }}>
          {total}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: `${color}.main`,
          backgroundColor: `${color}.light`,
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
