const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, 
  quantityAvailable: { type: Number, required: true },
  quantityAllocated: { type: Number, default: 0 },
  costPerUnit: { type: Number, required: false, default: 0 },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  location: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);