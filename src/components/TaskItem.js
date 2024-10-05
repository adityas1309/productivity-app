// src/components/TaskItem.js
import React from 'react';
import { ListItem, ListItemText, Button } from '@mui/material';

const TaskItem = ({ task }) => {
  const markAsCompleted = async () => {
    // Logic to mark the task as completed
  };

  return (
    <ListItem>
      <ListItemText
        primary={`${task.date} - HTML & CSS: ${task.html_css_todo}, Core Java: ${task.core_java_todo}, JavaScript: ${task.javascript_todo}`}
        secondary={task.completed ? 'Completed' : 'Pending'}
      />
      {!task.completed && (
        <Button variant="contained" onClick={markAsCompleted}>
          Mark as Completed
        </Button>
      )}
    </ListItem>
  );
};

export default TaskItem;
