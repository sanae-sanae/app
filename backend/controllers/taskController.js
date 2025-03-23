const Task = require('../models/Task');
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f creation dial task' });
  }
};
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'fullName')
      .populate('resources.resourceId', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Fshlna f jibda l-tasks' });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Ma l9inash l-task' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f update dial task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Ma l9inash l-task' });
    res.json({ message: 'Task t-deleta b nja7' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f delete dial task' });
  }
};