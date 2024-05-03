const express = require('express');
const router = express.Router();

let tasks = [];

// get all tasks

router.get('/tasks', (req, res) => {
    res.json(tasks);
});

// add a new task
router.post('/tasks', (req, res) => {
    const { title, isCompleted } = req.body;
    const newTask = { id: tasks.length + 1, title, isCompleted };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// update a task
router.put('/tasks/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const { title, isCompleted } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskID);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].isCompleted = isCompleted;
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskID);
    res.status(204).send();
});


module.exports = router;



