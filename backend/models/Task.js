const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }], 
  resources: [{
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource' },
    quantity: { type: Number, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);