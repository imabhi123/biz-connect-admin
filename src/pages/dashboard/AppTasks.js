import { Card, Typography, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { useState } from "react";

export default function AppTasks({ title, list }) {
  const [tasks, setTasks] = useState(list);

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Card sx={{ padding: "16px", borderRadius: "8px", boxShadow: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        {title}
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} disableGutters>
            <Checkbox
              checked={task.completed || false}
              onChange={() => toggleTask(task.id)}
            />
            <ListItemText
              primary={task.label}
              sx={{ textDecoration: task.completed ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
