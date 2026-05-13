const generateInsight = async (role, citizenProfile) => {
  const prompts = {
    clinician: `You are a clinical decision support AI. Based on the following citizen health and medical data, generate a structured JSON insight for a clinician.
Data: ${JSON.stringify(citizenProfile)}
Respond ONLY with a valid JSON object containing exactly these fields:
{
  "healthRiskAssessment": ["risk1", "risk2"],
  "emergencyHistorySummary": "summary string",
  "flaggedConditions": ["condition1"],
  "recommendedActions": ["action1"],
  "confidenceScore": 0.92
}`,
    employer: `You are an HR analytics AI. Based on this citizen's education and employment data, generate a structured JSON insight for an employer.
Data: ${JSON.stringify(citizenProfile)}
Respond ONLY with a valid JSON object containing exactly these fields:
{
  "academicCredibilityScore": 85,
  "employmentConsistencyAnalysis": "summary string",
  "credentialAuthenticityRating": "High/Medium/Low",
  "skillGaps": ["gap1"],
  "employabilityRating": 78,
  "confidenceScore": 0.88
}`,
    educator: `You are an academic analytics AI. Based on this citizen's academic record, generate a structured JSON insight for an educator.
Data: ${JSON.stringify(citizenProfile)}
Respond ONLY with a valid JSON object containing exactly these fields:
{
  "performanceTrendAnalysis": "summary string",
  "atRiskIndicators": ["indicator1"],
  "strongSubjectAreas": ["area1"],
  "recommendedInterventions": ["intervention1"],
  "confidenceScore": 0.85
}`,
    insurer: `You are an insurance fraud detection AI. Based on this citizen's claims data, generate a structured JSON insight for an insurance claims processor.
Data: ${JSON.stringify(citizenProfile)}
Respond ONLY with a valid JSON object containing exactly these fields:
{
  "claimPatternAnalysis": "summary string",
  "anomalyFlags": ["flag1"],
  "fraudRiskScore": 12,
  "claimsConsistencyRating": "High/Medium/Low",
  "recommendedActions": ["action1"],
  "confidenceScore": 0.91
}`
  };

  // Try OpenAI first
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompts[role] }],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      return { ...parsed, supervisorOverride: parsed.confidenceScore < 0.75 };
    } catch (err) {
      console.error('OpenAI error, using mock:', err.message);
    }
  }

  // Mock fallback (for development without API key)
  const mocks = {
    clinician: {
      healthRiskAssessment: ["High cardiovascular risk", "Type 2 diabetes indicators"],
      emergencyHistorySummary: "Patient has 3 prior emergency visits across 2 facilities. Last visit: chest pain.",
      flaggedConditions: ["Hypertension", "Elevated glucose"],
      recommendedActions: ["Immediate ECG", "Blood glucose test"],
      confidenceScore: 0.87,
      supervisorOverride: false
    },
    employer: {
      academicCredibilityScore: 82,
      employmentConsistencyAnalysis: "Consistent employment history with progressive roles over 4 years.",
      credentialAuthenticityRating: "High",
      skillGaps: ["Cloud computing", "Data analysis"],
      employabilityRating: 79,
      confidenceScore: 0.89,
      supervisorOverride: false
    },
    educator: {
      performanceTrendAnalysis: "Student shows improving GPA trend across 3 academic years.",
      atRiskIndicators: ["Attendance gaps in semester 2"],
      strongSubjectAreas: ["Mathematics", "Computer Science"],
      recommendedInterventions: ["Mentorship program", "Attendance monitoring"],
      confidenceScore: 0.84,
      supervisorOverride: false
    },
    insurer: {
      claimPatternAnalysis: "3 claims filed across 2 facilities within 6 months.",
      anomalyFlags: ["Duplicate claim amounts detected"],
      fraudRiskScore: 24,
      claimsConsistencyRating: "Medium",
      recommendedActions: ["Request facility verification", "Flag for manual review"],
      confidenceScore: 0.91,
      supervisorOverride: false
    }
  };

  return mocks[role];
};

module.exports = { generateInsight };