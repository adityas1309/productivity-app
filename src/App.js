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
    h3: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
});

const App = () => {
  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) console.error(error);
      else setTasks(data);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    let interval;
    
    const notifyIfPendingTasks = () => {
      const todayTasks = tasks.filter(task => task.date === today);
      const hasPendingTasks = todayTasks.some(task => !task.completed);

      if (hasPendingTasks) {
        new Notification('Task Reminder', {
          body: `You have incomplete tasks for today. Don't forget to complete them!`,
        });
      }
    };

    const checkPendingTasks = () => {
      const todayTasks = tasks.filter(task => task.date === today);
      const hasPendingTasks = todayTasks.some(task => !task.completed);

      if (hasPendingTasks) {
        notifyIfPendingTasks();
      } else {
        clearInterval(interval);
      }
    };

    interval = setInterval(checkPendingTasks, 45 * 60 * 1000);
    
    checkPendingTasks();

    return () => clearInterval(interval);
  }, [tasks, today]);

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

  const groupedTasks = tasks.reduce((acc, task) => {
    const weekNumber = task.week_no;

    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push(task);
    return acc;
  }, {});

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" className="container">
        <Typography variant="h3" gutterBottom align="center" className="heading">
          Lecture Tracker
        </Typography>
        {Object.keys(groupedTasks).map((weekNumber) => (
          <div key={weekNumber}>
            <Typography variant="h5" gutterBottom align="center">
              Week {weekNumber}
            </Typography>
            <List>
              {groupedTasks[weekNumber]
                .sort((a, b) => {
                  if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                  }
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  return dateA - dateB;
                })
                .map((task) => (
                  <div key={task.id} className={task.date === today ? 'present-day' : ''}>
                    {task.date === today && (
                      <Typography
                        variant="h5"
                        align="center"
                        className="present-day-label"
                      >
                        Present Day
                      </Typography>
                    )}
                    <Paper elevation={10} className="task-item" sx={{ padding: '16px', borderRadius: '12px' }}>
                      <ListItem className="task-list-item">
                        <ListItemText
                          primary={
                            <>
                              <Box
                                className="date-box"
                                sx={{
                                  backgroundColor: task.completed ? '#00796b' : '#d32f2f',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  display: 'inline-block',
                                  transition: 'background-color 0.3s ease',
                                  color: '#ffffff',
                                }}
                              >
                                {task.date}
                              </Box>
                              <Typography variant="subtitle1" className="lecture-label" sx={{ marginTop: '8px' }}>
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
                      <Divider sx={{ margin: '8px 0' }} />
                    </Paper>
                  </div>
                ))}
            </List>
          </div>
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default App;
