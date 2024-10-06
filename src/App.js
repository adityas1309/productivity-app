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
  Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import './styles/App.css'; // Import the CSS file

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
    <Container maxWidth="md" className="container">
      <Typography variant="h3" gutterBottom align="center" className="heading">
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
            <Paper key={task.id} elevation={5} className="task-item">
              <ListItem className="task-list-item">
                <ListItemText
                  primary={
                    <>
                      <Box
                        className="date-box"
                        sx={{
                          backgroundColor: task.completed ? '#c8e6c9' : '#ffcdd2',
                          padding: '8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        {task.date}
                      </Box>
                      <Typography variant="subtitle1" className="lecture-label">
                        Lectures to be watched:
                      </Typography>
                      <Typography variant="body1">
                        HTML & CSS: {task.html_css_todo}, Core Java: {task.core_java_todo}, JavaScript: {task.javascript_todo}
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        className={`status-label ${task.completed ? 'completed-status' : 'pending-status'}`}
                      >
                        {task.completed ? (
                          <>
                            <CheckCircleOutlineIcon className="status-icon" /> Completed
                          </>
                        ) : (
                          <>
                            <RadioButtonUncheckedIcon className="status-icon" /> Pending
                          </>
                        )}
                      </Typography>
                    </>
                  }
                />
                <Grid container justifyContent="flex-end">
                  {task.completed ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => markAsPending(task.id)}
                      className="action-button"
                    >
                      Mark as Pending
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => markAsCompleted(task.id)}
                      className="action-button"
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
