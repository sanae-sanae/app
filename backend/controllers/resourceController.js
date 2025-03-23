const Resource = require('../models/Resource');
exports.createResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource); // Kan-rj3u l-resource l-jdid
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f creation dial resource' });
  }
};
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('supplier', 'name');
    res.json(resources); // Kan-rj3u l-resources
  } catch (error) {
    res.status(500).json({ message: error.message || 'Fshlna f jibda l-resources' });
  }
};
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: 'Ma l9inash l-resource' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f update dial resource' });
  }
};
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Ma l9inash l-resource' });
    res.json({ message: 'Resource t-deleta b nja7' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f delete dial resource' });
  }
};