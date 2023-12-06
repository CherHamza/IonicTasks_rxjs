import React, { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  tasksSubject,
} from "../services/taskService";
import { map } from "rxjs/operators";
import { Dialog } from "@capacitor/dialog";
import "./Home.css";

interface Task {
  id: number;
  label: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState<string>("");
  const [doubleClickId, setDoubleClickId] = useState<number | null>(null);

  useEffect(() => {
    const subscription = tasksSubject
      .pipe(
        map((tasks: Task[]) => {
          const sortedTasks = [...tasks].sort((a, b) => {
            if (a.completed && !b.completed) return 1; 
            if (!a.completed && b.completed) return -1; 
            return 0;
          });
          setTasks(sortedTasks);
          return sortedTasks;
        })
      )
      .subscribe();
    getTasks();
    return () => subscription.unsubscribe();
  }, []);


  const handleAddTask = async () => {
    if (newTaskLabel.trim() !== "") {
      const newTask: Task = { id: 0, label: newTaskLabel, completed: false };
      const confirm = await showConfirm('Confirmez l\'ajout de tâche')
      if(confirm) {
        await addTask(newTask);
        setNewTaskLabel('');
      }
    } else {
      showAlert("Vous devez entrer une tâche!");
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
      }, 3000); 
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if(taskId){
      const confirm = await showConfirm('Confirmez la suppression de la tâche')
        if(confirm) {
          await deleteTask(taskId);
          setNewTaskLabel('');
        }
    }
  };


  const showAlert = async (message: string) => {
    await Dialog.alert({
      title: "Stop",
      message: message,
    });
  };

  const showConfirm = async (message: string) => {
    const { value } = await Dialog.confirm({
      title: "Confirm",
      message: message,
    });
    return value;
  };

  return (
    <div className="task-list-container">
      <h1 className="title">Task List</h1>
      <div className="add-task-container">
        <input
          type="text"
          placeholder="New Task Label"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}/>

        <button className="add-task-button" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <ul className="tasks-list">
        {tasks
            .map((task) => (
          <li className="task-item" key={task.id}>
            <span
              className={`task-label ${
                doubleClickId === task.id ? "double-click" : ""
              }`}
              onClick={() => handleUpdateTask(task)}
            >
              {task.completed ? <s>{task.label}</s> : task.label}
            </span>
            <button
              className={`update-task-button${
                doubleClickId === task.id ? " active" : ""
              }`}
              onClick={() => handleUpdateTask(task)}
            >
              {task.completed ? "Invalidate" : "Validate"}
            </button>
            <button
              className="delete-task-button"
              onClick={() => handleDeleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
