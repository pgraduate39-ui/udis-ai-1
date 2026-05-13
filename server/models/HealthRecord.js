const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  citizenId: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String },
  chronicConditions: [{ type: String }],
  currentMedications: [{ type: String }],
  visitHistory: [{
    date: Date,
    facility: String,
    diagnosis: String,
    treatment: String
  }]
}, { timestamps: true, collection: 'health_records' });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);