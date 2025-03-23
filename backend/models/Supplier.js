const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  resourcesSupplied: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Supplier', supplierSchema);