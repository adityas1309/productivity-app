// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TaskItem from './TaskItem';
import { List, Typography } from '@mui/material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('your_table_name').select('*');
      if (error) console.error(error);
      else setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </List>
  );
};

export default TaskList;
