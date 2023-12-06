// src/services/taskService.ts
import { BehaviorSubject } from 'rxjs';

const BASE_URL = 'http://localhost:3001';

interface Task {
  id: number;
  label: string;
  completed: boolean;
}

const tasksSubject = new BehaviorSubject<Task[]>([]);


async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`);
  const tasks = await response.json();
  tasksSubject.next(tasks);
  return tasks;
}

async function addTask(task: Task) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  const createdTask = await response.json();
  const currentTasks = tasksSubject.getValue();
  tasksSubject.next([...currentTasks, createdTask]);
  return createdTask;
}

async function updateTask(task: Task) {
  const response = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  const updatedTask = await response.json();
  const currentTasks = tasksSubject.getValue();
  const updatedTasks = currentTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
  tasksSubject.next(updatedTasks);
  return updatedTask;
}

async function deleteTask(taskId: number) {
  await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  const currentTasks = tasksSubject.getValue();
  const updatedTasks = currentTasks.filter((t) => t.id !== taskId);
  tasksSubject.next(updatedTasks);
}

export { getTasks, addTask, updateTask, deleteTask, tasksSubject };
