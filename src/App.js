import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import './styles/App.css';

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
      .update({ completed: true })
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

  const markAsPending = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: false })
      .eq('id', taskId);

    if (error) console.error(error);
    else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: false } : task
        )
      );
    }
  };

  return (
    <Container maxWidth="lg" className="container">
      <Typography variant="h4" gutterBottom align="center">
        Lecture Tracker
      </Typography>
      <List>
        {tasks
          .sort((a, b) => {
            
            if (a.completed !== b.completed) {
              return a.completed - b.completed;
            }

            
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          })
          .map((task) => (
            <Paper key={task.id} elevation={2} className="task-item">
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <strong style={{ fontWeight: 'bold' }}>{task.date}</strong>{' '}
                      - HTML & CSS: {task.html_css_todo}, Core Java: {task.core_java_todo}, JavaScript: {task.javascript_todo}
                    </>
                  }
                  secondary={`Remaining: HTML & CSS: ${task.html_css_rem}, Core Java: ${task.core_java_rem}, JavaScript: ${task.javascript_rem} | Status: ${task.completed ? 'Completed' : 'Pending'}`}
                  className={task.completed ? 'completed' : 'pending'}
                />
                <Grid container justifyContent="flex-end">
                  {task.completed ? (
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => markAsPending(task.id)} 
                      className="button"
                    >
                      Mark as Pending
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => markAsCompleted(task.id)} 
                      className="button"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </Grid>
              </ListItem>
              <Divider />
            </Paper>
          ))}
      </List>
    </Container>
  );
};

export default App;
