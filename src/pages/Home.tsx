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
  const [newTaskLabel, setNewTaskLabel] = useState<string>(''); // Ajout d'un état local pour le libellé de la nouvelle tâche

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
    if (newTaskLabel.trim() !== '') { // Vérif que le libellé n'est pas vide
      const newTask: Task = { id: 0, label: newTaskLabel, completed: false };
      await addTask(newTask);
      setNewTaskLabel(''); // Réinitialise le libellé de la nouvelle tâche après l'ajout
    }
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
      <div>
        <input
          type="text"
          placeholder="New Task Label"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

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
