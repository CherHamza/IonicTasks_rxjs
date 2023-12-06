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
          setTasks(tasks);
          return tasks;
        })
      )
      .subscribe();

    // Fetch initial tasks
    getTasks();
    return () => subscription.unsubscribe();
  }, []);

  const handleAddTask = async () => {
    // Vérif que le libellé n'est pas vide
    if (newTaskLabel.trim() !== "") {
      const newTask: Task = { id: 0, label: newTaskLabel, completed: true };
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
      }, 3000); // Délai de 3 secondes pour le double clic
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
          onChange={(e) => setNewTaskLabel(e.target.value)}
        />

        <button className="add-task-button" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <ul className="tasks-list">
        {tasks
            .map((task) => (
          <li className="task-item" key={task.id}>
            <span className={task.completed ? "invalidate" : "validate"}>
              {task.label}
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
