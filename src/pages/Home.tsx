import React, { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask, tasksSubject } from '../services/taskService';
import { map } from 'rxjs/operators';

interface Task {
  id: number;
  label: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const subscription = tasksSubject.pipe(
      map((tasks: Task[]) => {
        setTasks(tasks);
        return tasks; 
      })
    ).subscribe();
  
    // Fetch initial tasks
    getTasks();
  
    return () => subscription.unsubscribe();
  }, []);

  const handleAddTask = async () => {
    const newTask: Task = { id: 0, label: 'New Task', completed: false };
    await addTask(newTask);
  };

  const handleUpdateTask = async (task: Task) => {
    await updateTask({ ...task, completed: !task.completed });
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
  };

  return (
    <div>
      <h1>Task List</h1>
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.label}</span>
            <button onClick={() => handleUpdateTask(task)}>
              {task.completed ? 'Invalidate' : 'Validate'}
            </button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
