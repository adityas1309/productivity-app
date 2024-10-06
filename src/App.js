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
  const [timeLeft, setTimeLeft] = useState('');
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
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const difference = endOfDay - now;

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
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

        <Typography variant="h6" align="center" className="countdown" sx={{ marginBottom: '20px' }}>
          Time Left Until Midnight: {timeLeft}
        </Typography>

        {Object.keys(groupedTasks).map((weekNumber) => (
          <div key={weekNumber} style={{ marginBottom: '40px' }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '20px' }}>
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
                        sx={{ marginBottom: '15px' }}
                      >
                        Present Day
                      </Typography>
                    )}
                    <Paper elevation={3} className="task-item" sx={{ padding: '16px', borderRadius: '12px', marginBottom: '15px' }}>
                      <ListItem className="task-list-item" sx={{ padding: '0' }}>
                        <ListItemText
                          primary={
                            <>
                              <Box
                                className="date-box"
                                sx={{
                                  backgroundColor: task.completed ? '#00796b' : '#d32f2f',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  display: 'inline-block',
                                  transition: 'background-color 0.3s ease',
                                  color: '#ffffff',
                                  marginBottom: '10px',
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
                                <Box display="flex" alignItems="center">
                                  <CheckCircleOutlineIcon className="status-icon" /> 
                                  <span style={{ marginLeft: '8px' }}>Completed</span>
                                </Box>
                              ) : (
                                <Box display="flex" alignItems="center">
                                  <RadioButtonUncheckedIcon className="status-icon" /> 
                                  <span style={{ marginLeft: '8px' }}>Pending</span>
                                </Box>
                              )}
                            </Typography>
                          }
                          
                          
                        />
                        <Grid container justifyContent="flex-end">
                          <Button
                            variant={task.completed ? "outlined" : "contained"}
                            color={task.completed ? "secondary" : "primary"}
                            onClick={() => task.completed ? markAsPending(task.id) : markAsCompleted(task.id)}
                            className="action-button"
                            sx={{ marginLeft: '10px' }}
                          >
                            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                          </Button>
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
