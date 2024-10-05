// src/App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) console.error(error);
      else setTasks(data);
    };

    fetchTasks();
  }, []);

  const markAsCompleted = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true }) // Updates the 'completed' column
      .eq('id', taskId);

    if (error) console.error(error);
    else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lecture Tracker
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText
              primary={`${task.date} - HTML & CSS: ${task.html_css_todo}, Core Java: ${task.core_java_todo}, JavaScript: ${task.javascript_todo}`}
              secondary={task.completed ? 'Completed' : 'Pending'}
            />
            {!task.completed && (
              <Button variant="contained" onClick={() => markAsCompleted(task.id)}>
                Mark as Completed
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
