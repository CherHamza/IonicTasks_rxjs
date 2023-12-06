import React, { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask, tasksSubject } from '../services/taskService';
import { map } from 'rxjs/operators';
import './Home.css'; 

interface Task {
  id: number;
  label: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState<string>('');
  const [doubleClickId, setDoubleClickId] = useState<number | null>(null);

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
    if (newTaskLabel.trim() !== '') {
      const newTask: Task = { id: 0, label: newTaskLabel, completed: false };
      await addTask(newTask);
      setNewTaskLabel('');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    if (doubleClickId === task.id) {
      await updateTask({ ...task, completed: !task.completed });
      setDoubleClickId(null);
    } else {
      setDoubleClickId(task.id);
      setTimeout(() => {
        setDoubleClickId(null);
      }, 3000); // Délai de 3 secondes pour le double clic
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
  };

  return (
    <div className="task-list-container">
      <h1 className="title">Task List</h1>
      <div className="add-task-container">
        <input
          type="text"
          placeholder="New Task Label"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
        />
        <button className="add-task-button" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li className="task-item" key={task.id}>
            <span>{task.label}</span>
            <button
              className={`update-task-button${doubleClickId === task.id ? ' active' : ''}`}
              onClick={() => handleUpdateTask(task)}
            >
              {task.completed ? 'Invalidate' : 'Validate'}
            </button>
            <button className="delete-task-button" onClick={() => handleDeleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
