const Task = require('../models/Task');

// Get all tasks (admin only)
exports.getAllTasks = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }

        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Retrieve all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Retrieve task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ error: 'Title and Due Date are required' });
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user.id,
        });

        const task = await newTask.save();
        res.json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user.id) {
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
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a task
// Example error handling in deleteTask
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this task' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

