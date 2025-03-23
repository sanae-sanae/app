const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  actualCost: { type: Number, default: 0 }, 
  status: { type: String, enum: ['planned', 'active', 'completed', 'on-hold'], default: 'planned' },
  phases: [{
    name: String,
    startDate: Date,
    endDate: Date,
    completed: { type: Boolean, default: false },
  }],
  manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);