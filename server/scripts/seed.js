require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const EducationRecord = require('../models/EducationRecord');
const EmploymentRecord = require('../models/EmploymentRecord');
const InsuranceRecord = require('../models/InsuranceRecord');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 'None'];
const medications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Salbutamol'];
const facilities = ['KNH', 'Aga Khan Hospital', 'MP Shah', 'Nairobi Hospital', 'Mater Hospital'];
const programmes = ['Computer Science', 'Medicine', 'Law', 'Business', 'Engineering'];
const institutions = ['University of Nairobi', 'Kenyatta University', 'Strathmore', 'JKUAT', 'Karatina University'];
const employers = ['Safaricom', 'Equity Bank', 'Nation Media', 'KCB Group', 'KPLC'];
const titles = ['Software Engineer', 'Doctor', 'Analyst', 'Manager', 'Consultant'];
const skills = ['Python', 'React', 'Node.js', 'SQL', 'Project Management', 'Data Analysis'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); }

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Seeding...');

  await User.deleteMany({});
  await HealthRecord.deleteMany({});
  await EducationRecord.deleteMany({});
  await EmploymentRecord.deleteMany({});
  await InsuranceRecord.deleteMany({});

  // Seed users
  const password = await bcrypt.hash('password123', 12);
  await User.insertMany([
    { name: 'Dr. Amina Osei', email: 'clinician@test.com', password, role: 'clinician' },
    { name: 'James Mwangi', email: 'employer@test.com', password, role: 'employer' },
    { name: 'Prof. Grace Njoki', email: 'educator@test.com', password, role: 'educator' },
    { name: 'Faith Kariuki', email: 'insurer@test.com', password, role: 'insurer' }
  ]);
  console.log('✓ Users seeded');

  // Seed 125 citizen records
  const healthRecords = [], educationRecords = [], employmentRecords = [], insuranceRecords = [];

  for (let i = 1; i <= 125; i++) {
    const citizenId = `KE-${String(i).padStart(6, '0')}`;
    const fullName = `Citizen ${i} Test`;

    healthRecords.push({
      citizenId, fullName,
      dateOfBirth: randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1)),
      bloodGroup: randomItem(bloodGroups),
      chronicConditions: [randomItem(conditions), randomItem(conditions)].filter(c => c !== 'None'),
      currentMedications: Math.random() > 0.5 ? [randomItem(medications)] : [],
      visitHistory: Array.from({ length: randomInt(1, 4) }, () => ({
        date: randomDate(new Date(2020, 0, 1), new Date()),
        facility: randomItem(facilities),
        diagnosis: randomItem(conditions),
        treatment: 'Standard treatment protocol applied'
      }))
    });

    educationRecords.push({
      citizenId, fullName,
      institutionName: randomItem(institutions),
      programme: randomItem(programmes),
      gpa: parseFloat((Math.random() * 1.5 + 2.5).toFixed(2)),
      academicYears: [
        { year: '2020/2021', gpa: parseFloat((Math.random() * 1.5 + 2.5).toFixed(2)), awards: Math.random() > 0.7 ? 'Deans List' : 'None' },
        { year: '2021/2022', gpa: parseFloat((Math.random() * 1.5 + 2.5).toFixed(2)), awards: 'None' },
        { year: '2022/2023', gpa: parseFloat((Math.random() * 1.5 + 2.5).toFixed(2)), awards: Math.random() > 0.8 ? 'Best Student' : 'None' }
      ]
    });

    employmentRecords.push({
      citizenId, fullName,
      employerName: randomItem(employers),
      jobTitle: randomItem(titles),
      startDate: randomDate(new Date(2015, 0, 1), new Date(2020, 0, 1)),
      endDate: randomDate(new Date(2021, 0, 1), new Date()),
      performanceRating: randomInt(2, 5),
      skills: [randomItem(skills), randomItem(skills), randomItem(skills)]
    });

    insuranceRecords.push({
      citizenId, fullName,
      policyNumber: `POL-${String(i).padStart(5, '0')}`,
      claimDate: randomDate(new Date(2021, 0, 1), new Date()),
      claimAmount: randomInt(5000, 250000),
      approvalStatus: randomItem(['approved', 'rejected', 'pending']),
      facilityName: randomItem(facilities)
    });
  }

  await HealthRecord.insertMany(healthRecords);
  await EducationRecord.insertMany(educationRecords);
  await EmploymentRecord.insertMany(employmentRecords);
  await InsuranceRecord.insertMany(insuranceRecords);

  console.log('✓ 125 health records seeded');
  console.log('✓ 125 education records seeded');
  console.log('✓ 125 employment records seeded');
  console.log('✓ 125 insurance records seeded');
  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  clinician@test.com / password123');
  console.log('  employer@test.com  / password123');
  console.log('  educator@test.com  / password123');
  console.log('  insurer@test.com   / password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });