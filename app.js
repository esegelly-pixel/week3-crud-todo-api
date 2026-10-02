const express = require("express");

const app = express();
app.use(express.json());

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false }
];

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Todo API is running" });
});

// GET all todos
app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

// GET active todos
app.get("/todos/active", (req, res) => {
  const active = todos.filter((todo) => !todo.completed);
  res.status(200).json(active);
});

// GET completed todos
app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((todo) => todo.completed);
  res.status(200).json(completed);
});

// GET one todo
app.get("/todos/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json(todo);
});

// CREATE a todo
app.post("/todos", (req, res) => {
  const { task } = req.body;

  if (typeof task !== "string" || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }

  const newTodo = {
    id: todos.length ? Math.max(...todos.map((item) => item.id)) + 1 : 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// UPDATE a todo
app.patch("/todos/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (req.body.task !== undefined) {
    if (typeof req.body.task !== "string" || !req.body.task.trim()) {
      return res.status(400).json({ error: "Task must be a non-empty string" });
    }
    todo.task = req.body.task.trim();
  }

  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be true or false" });
    }
    todo.completed = req.body.completed;
  }

  res.status(200).json(todo);
});

// DELETE a todo
app.delete("/todos/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const initialLength = todos.length;

  todos = todos.filter((item) => item.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(204).send();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error!" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Todo API running on port ${PORT}`);
});
