const Supplier = require('../models/Supplier');
exports.createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f creation dial supplier' });
  }
};
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Fshlna f jibda l-suppliers' });
  }
};
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) return res.status(404).json({ message: 'Ma l9inash l-supplier' });
    res.json(supplier); 
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f update dial supplier' });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Ma l9inash l-supplier' });
    res.json({ message: 'Supplier t-deleta b nja7' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Fshlna f delete dial supplier' });
  }
};