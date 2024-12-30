import { Card, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function AppNewsUpdate({ title, list }) {
  return (
    <Card sx={{ padding: "16px", borderRadius: "8px", boxShadow: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        {title}
      </Typography>
      <List>
        {list.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={item.title}
                secondary={`Published: ${item.createdAt}`}
              />
            </ListItem>
            {index < list.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}
