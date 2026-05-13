const mongoose = require('mongoose');

const educationRecordSchema = new mongoose.Schema({
  citizenId: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  institutionName: { type: String },
  programme: { type: String },
  gpa: { type: Number },
  academicYears: [{
    year: String,
    gpa: Number,
    awards: String
  }]
}, { timestamps: true, collection: 'education_records' });

module.exports = mongoose.model('EducationRecord', educationRecordSchema);