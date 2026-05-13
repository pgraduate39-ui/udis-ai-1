const mongoose = require('mongoose');

const employmentRecordSchema = new mongoose.Schema({
  citizenId: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  employerName: { type: String },
  jobTitle: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  performanceRating: { type: Number, min: 1, max: 5 },
  skills: [{ type: String }]
}, { timestamps: true, collection: 'employment_records' });

module.exports = mongoose.model('EmploymentRecord', employmentRecordSchema);