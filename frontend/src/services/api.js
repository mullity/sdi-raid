const BASE_URL = "http://localhost:3001";

// Helper to get cookie value
function getCookie() {
  return document.cookie.split("=")[1] || undefined;
}

// Generic API call function with error handling
const apiCall = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
    const token = getCookie("loginToken");
    console.log("Sending token:", token); // Debug log
    const response = await fetch(url, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// gets the main dashboard data
export const getSnapshot = async (unit, verbose = null) => {
  const params = { unit };
  if (verbose !== null) params.verbose = verbose.toString();

  return await apiCall("/snapshot", params);
};

// gets kpi stuff with filters
export const getKPI = async (unit, options = {}) => {
  const params = { unit };

  // bunch of optional params
  const {
    verbose,
    personnelReadinessScore,
    equipmentReadinessScore,
    trainingReadinessScore,
    medicalReadinessScore,
  } = options;

  if (verbose !== undefined) params.verbose = verbose.toString();
  if (personnelReadinessScore !== undefined)
    params.personnelReadinessScore = personnelReadinessScore.toString();
  if (equipmentReadinessScore !== undefined)
    params.equipmentReadinessScore = equipmentReadinessScore.toString();
  if (trainingReadinessScore !== undefined)
    params.trainingReadinessScore = trainingReadinessScore.toString();
  if (medicalReadinessScore !== undefined)
    params.medicalReadinessScore = medicalReadinessScore.toString();

  return await apiCall("/kpi", params);
};

// snapshot data but sorted by worst first
export const getPriority = async (unit, verbose = null) => {
  const params = { unit };
  if (verbose !== null) params.verbose = verbose.toString();

  return await apiCall("/priority", params);
};

// modal popup data
export const getModal = async (unit, options = {}) => {
  const params = { unit };

  // more params
  const {
    verbose,
    vicModalValue,
    deploymentModalValue,
    crewModalValue,
    medModalValue,
    weaponModalValue,
  } = options;

  if (verbose !== undefined) params.verbose = verbose.toString();
  if (vicModalValue !== undefined)
    params.vicModalValue = vicModalValue.toString();
  if (deploymentModalValue !== undefined)
    params.deploymentModalValue = deploymentModalValue.toString();
  if (crewModalValue !== undefined)
    params.crewModalValue = crewModalValue.toString();
  if (medModalValue !== undefined)
    params.medModalValue = medModalValue.toString();
  if (weaponModalValue !== undefined)
    params.weaponModalValue = weaponModalValue.toString();

  return await apiCall("/modal", params);
};

// lookup unit by uic code
export const getUsersUIC = async (uic) => {
  return await apiCall("/users/uic", { uic });
};

// grabs everything at once
export const getAllReadinessData = async (unit) => {
  try {
    const [snapshot, priority, kpi] = await Promise.all([
      getSnapshot(unit),
      getPriority(unit),
      getKPI(unit, {
        verbose: true,
        personnelReadinessScore: true,
        equipmentReadinessScore: true,
        trainingReadinessScore: true,
        medicalReadinessScore: true,
      }),
    ]);

    return {
      snapshot,
      priority,
      kpi,
    };
  } catch (error) {
    console.error("Failed to fetch all readiness data:", error);
    throw error;
  }
};

export const getDetailedModal = async (unit) => {
  return await getModal(unit, {
    verbose: true,
    vicModalValue: true,
    deploymentModalValue: true,
    crewModalValue: true,
    medModalValue: true,
    weaponModalValue: true,
  });
};

// recommendations data - currently using mock data until backend endpoint is implemented
export const getRecommendations = async (unit, priorityItem) => {
  // Mock implementation that returns fallback data
  // In the future, this could call a real backend endpoint
  const fallbackRecommendations = {
    'Medical Readiness Review': {
      title: 'Medical Readiness Review',
      urgency: 'High',
      recommendations: [
        'Schedule immediate MEDPROS updates for all personnel',
        'Coordinate with medical personnel for overdue physicals',
        'Review and update immunization records',
        'Ensure dental readiness is current for deployment',
        'Complete vision and hearing tests for critical personnel'
      ],
      resources: [
        'MEDPROS System Access',
        'Unit Medical Personnel',
        'AR 40-501 Standards of Medical Fitness'
      ],
      timeline: '7 days',
      impact: 'Required for deployment certification and personnel health'
    },
    'Training Records Update': {
      title: 'Training Records Update',
      urgency: 'Medium',
      recommendations: [
        'Audit individual training records in DTMS',
        'Update expired certifications and qualifications',
        'Schedule make-up training for deficient personnel',
        'Verify MOS-specific training requirements',
        'Document all training completions properly'
      ],
      resources: [
        'DTMS (Digital Training Management System)',
        'Training NCO',
        'Unit Training Records'
      ],
      timeline: '14 days',
      impact: 'Ensures unit maintains training readiness standards'
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return recommendations based on priority item or default
  const priorityType = priorityItem?.type || priorityItem?.title || 'Training Records Update';
  return fallbackRecommendations[priorityType] || fallbackRecommendations['Training Records Update'];
};
