const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const auditLog = require('../middleware/auditLog');
const {
  getClinicianInsight,
  getEmployerInsight,
  getEducatorInsight,
  getInsurerInsight,
  getCitizenIds
} = require('../controllers/insightController');

router.get('/citizens', protect, getCitizenIds);
router.get('/health/:citizenId', protect, authorize('clinician'), auditLog, getClinicianInsight);
router.get('/employment/:citizenId', protect, authorize('employer'), auditLog, getEmployerInsight);
router.get('/education/:citizenId', protect, authorize('educator'), auditLog, getEducatorInsight);
router.get('/insurance/:citizenId', protect, authorize('insurer'), auditLog, getInsurerInsight);

module.exports = router;