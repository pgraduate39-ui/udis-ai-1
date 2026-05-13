const mongoose = require('mongoose');

const insuranceRecordSchema = new mongoose.Schema({
  citizenId: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  policyNumber: { type: String },
  claimDate: { type: Date },
  claimAmount: { type: Number },
  approvalStatus: { type: String, enum: ['approved', 'rejected', 'pending'] },
  facilityName: { type: String }
}, { timestamps: true, collection: 'insurance_records' });

module.exports = mongoose.model('InsuranceRecord', insuranceRecordSchema);