const Task = require('../models/Task');

// GET all tasks for a particular user (admin only)
exports.getTasksByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all tasks for all users (admin only)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create a task for a particular user (admin only)
exports.createTaskForUser = async (req, res) => {
  const { userId } = req.params;
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: userId,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// PUT update a task by ID for a particular user (admin only)
exports.updateTaskForUser = async (req, res) => {
  const { userId, taskId } = req.params;
  const { title, description, dueDate, priority, status } = req.body;

  try {
    let task = await Task.findById(taskId);

    if (!task || task.user.toString() !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE a task by ID for a particular user (admin only)
exports.deleteTaskForUser = async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task || task.user.toString() !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
