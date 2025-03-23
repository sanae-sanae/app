const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
router.post('/', auth(['manager', 'admin']), async (req, res) => {
  try {
    const projectData = { ...req.body, manager: req.user.id };
    console.log('Creating project with data:', projectData);
    const project = new Project(projectData);
    await project.save(); 
    res.status(201).json(project);
  } catch (error) {
    console.log('Create project error:', error);
    res.status(400).json({ message: error.message || 'Fshlna f creation dial project' });
  }
});

router.get('/', auth(), async (req, res) => {
  try {
    console.log('Fetching projects for user:', req.user); 
    const projects = await Project.find().populate('manager', 'fullName'); 
    res.json(projects);
  } catch (error) {
    console.log('Get projects error:', error);
    res.status(500).json({ message: error.message || 'Fshlna f jibda l-projects' }); 
  }
});
router.put('/:id', auth(['manager', 'admin']), async (req, res) => {
  try {
    console.log('Updating project ID:', req.params.id, 'with data:', req.body);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Ma l9inash l-project' }); 
    res.json(project);
  } catch (error) {
    console.log('Update project error:', error); 
    res.status(400).json({ message: error.message || 'Fshlna f update dial project' });
  }
});
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    console.log('Deleting project ID:', req.params.id); 
    const project = await Project.findByIdAndDelete(req.params.id); 
    if (!project) return res.status(404).json({ message: 'Ma l9inash l-project' });  
    res.json({ message: 'Project t-deleta b nja7' }); 
  } catch (error) {
    console.log('Delete project error:', error); 
    res.status(400).json({ message: error.message || 'Fshlna f delete dial project' }); 
  }
});

module.exports = router;