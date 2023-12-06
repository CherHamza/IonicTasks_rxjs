import React, { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask, tasksSubject } from '../services/taskService';
import { map } from 'rxjs/operators';
import { Dialog } from '@capacitor/dialog';

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
// Vérif que le libellé n'est pas vide
    if (newTaskLabel.trim() !== '') { 
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
const showAlert = async () => {
  await Dialog.alert({
    title: 'Stop',
    message: 'this is an error',
  });
};

const showConfirm = async () => {
  const { value } = await Dialog.confirm({
    title: 'Confirm',
    message: `Confirmez l'ajout de tâches `,
  });
// mettre la logique ici 
if(value === true ) {
  console.log('add')
  handleAddTask();
} else {
  console.log('not add')
}
};

const showPrompt = async () => {
  const { value, cancelled } = await Dialog.prompt({
    title: 'Hello',
    message: `What's your name?`,
  });

  console.log('Name:', value);
  console.log('Cancelled:', cancelled);
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
        <button onClick={ showConfirm }>Add Task</button>
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