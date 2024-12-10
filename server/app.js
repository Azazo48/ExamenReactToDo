import express from "express";
import {
  taskCompleted,
  addTask,
  editTask,
  deleteTask,
  seeTasks
} from "./database.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/tasks", async (req, res) => {
  const tasks = await seeTasks();
  console.log('Tareas obtenidas!');
  res.status(200).json(tasks);
});

app.patch("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  await taskCompleted(id);
  res.status(200).json({ message: "Tarea marcada como completada" });
});

app.post("/tasks", async (req, res) => {
  const { name, date, time, description } = req.body;
  const result = await addTask(name, date, time, description);
  console.log('Tarea agregada, ID:');
  res.status(201).json({ message: "Tarea agregada"});
});

app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, date, time, description } = req.body;
  await editTask(id, name, date, time, description);
  res.status(200).json({ message: "Tarea actualizada" });
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await deleteTask(id);
  res.status(200).json({ message: "Tarea eliminada" });
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en el puerto 3000");
});
