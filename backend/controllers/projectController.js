const Project = require('../models/Project');
exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body, manager: req.user.id };
    console.log('Creating project with data:', projectData); // Debug
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.log('Create project error:', error); // Debug
    res.status(400).json({ message: error.message || 'Failed to create project' });
  }
};
exports.getProjects = async (req, res) => {
  try {
    console.log('Fetching projects for user:', req.user.id); // Debug
    const projects = await Project.find().populate('manager', 'fullName');
    res.json(projects);
  } catch (error) {
    console.log('Get projects error:', error); // Debug
    res.status(500).json({ message: error.message || 'Failed to fetch projects' });
  }
};
exports.updateProject = async (req, res) => {
  try {
    console.log('Updating project ID:', req.params.id, 'with data:', req.body); // Debug
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.log('Update project error:', error); // Debug
    res.status(400).json({ message: error.message || 'Failed to update project' });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    console.log('Deleting project ID:', req.params.id); // Debug
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.log('Delete project error:', error); // Debug
    res.status(400).json({ message: error.message || 'Failed to delete project' });
  }
};