const HealthRecord = require('../models/HealthRecord');
const EducationRecord = require('../models/EducationRecord');
const EmploymentRecord = require('../models/EmploymentRecord');
const InsuranceRecord = require('../models/InsuranceRecord');
const { generateInsight } = require('../utils/aiInsight');

// Normalize data into unified citizen profile
const normalizeProfile = (health, education, employment, insurance) => {
  return {
    health: health ? {
      bloodGroup: health.bloodGroup,
      chronicConditions: health.chronicConditions,
      currentMedications: health.currentMedications,
      recentVisits: health.visitHistory?.slice(-3)
    } : null,
    education: education ? {
      institution: education.institutionName,
      programme: education.programme,
      gpa: education.gpa,
      academicYears: education.academicYears
    } : null,
    employment: employment ? {
      currentRole: employment.jobTitle,
      employer: employment.employerName,
      performanceRating: employment.performanceRating,
      skills: employment.skills
    } : null,
    insurance: insurance ? {
      policyNumber: insurance.policyNumber,
      claimAmount: insurance.claimAmount,
      approvalStatus: insurance.approvalStatus,
      facility: insurance.facilityName
    } : null
  };
};

exports.getClinicianInsight = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const health = await HealthRecord.findOne({ citizenId });
    const insurance = await InsuranceRecord.findOne({ citizenId });
    if (!health) return res.status(404).json({ message: 'No health record found for this citizen ID' });

    const profile = normalizeProfile(health, null, null, insurance);
    const insight = await generateInsight('clinician', profile);

    res.json({ citizenId, role: 'clinician', insight, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployerInsight = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const education = await EducationRecord.findOne({ citizenId });
    const employment = await EmploymentRecord.findOne({ citizenId });
    if (!education && !employment) return res.status(404).json({ message: 'No records found for this citizen ID' });

    const profile = normalizeProfile(null, education, employment, null);
    const insight = await generateInsight('employer', profile);

    res.json({ citizenId, role: 'employer', insight, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEducatorInsight = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const education = await EducationRecord.findOne({ citizenId });
    if (!education) return res.status(404).json({ message: 'No education record found for this citizen ID' });

    const profile = normalizeProfile(null, education, null, null);
    const insight = await generateInsight('educator', profile);

    res.json({ citizenId, role: 'educator', insight, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInsurerInsight = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const insurance = await InsuranceRecord.findOne({ citizenId });
    const health = await HealthRecord.findOne({ citizenId });
    if (!insurance) return res.status(404).json({ message: 'No insurance record found for this citizen ID' });

    const profile = normalizeProfile(health, null, null, insurance);
    const insight = await generateInsight('insurer', profile);

    res.json({ citizenId, role: 'insurer', insight, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCitizenIds = async (req, res) => {
  try {
    const records = await HealthRecord.find({}, 'citizenId fullName').limit(20);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};