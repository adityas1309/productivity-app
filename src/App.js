import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
import './styles/App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

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
    <ThemeProvider theme={darkTheme}>
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
              <Paper key={task.id} elevation={10} className="task-item">
                <ListItem className="task-list-item">
                  <ListItemText
                    primary={
                      <>
                        <Box
                          className="date-box"
                          sx={{
                            backgroundColor: task.completed ? '#00796b' : '#d32f2f',
                            padding: '10px',
                            borderRadius: '12px',
                            display: 'inline-block',
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          {task.date}
                        </Box>
                        <Typography variant="subtitle1" className="lecture-label">
                          Lectures to be watched:
                        </Typography>
                        <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>
  HTML & CSS: {task.html_css_todo}, Core Java: {task.core_java_todo}, JavaScript: {task.javascript_todo}
</Typography>

                      </>
                    }
                    secondary={
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
    </ThemeProvider>
  );
};

export default App;
