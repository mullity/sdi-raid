const BASE_URL = 'http://localhost:3001';

// just does fetch requests to backend
const apiCall = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
    const response = await fetch(url);

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

  return await apiCall('/snapshot', params);
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
    medicalReadinessScore
  } = options;

  if (verbose !== undefined) params.verbose = verbose.toString();
  if (personnelReadinessScore !== undefined) params.personnelReadinessScore = personnelReadinessScore.toString();
  if (equipmentReadinessScore !== undefined) params.equipmentReadinessScore = equipmentReadinessScore.toString();
  if (trainingReadinessScore !== undefined) params.trainingReadinessScore = trainingReadinessScore.toString();
  if (medicalReadinessScore !== undefined) params.medicalReadinessScore = medicalReadinessScore.toString();

  return await apiCall('/kpi', params);
};

// snapshot data but sorted by worst first
export const getPriority = async (unit, verbose = null) => {
  const params = { unit };
  if (verbose !== null) params.verbose = verbose.toString();

  return await apiCall('/priority', params);
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
    weaponModalValue
  } = options;

  if (verbose !== undefined) params.verbose = verbose.toString();
  if (vicModalValue !== undefined) params.vicModalValue = vicModalValue.toString();
  if (deploymentModalValue !== undefined) params.deploymentModalValue = deploymentModalValue.toString();
  if (crewModalValue !== undefined) params.crewModalValue = crewModalValue.toString();
  if (medModalValue !== undefined) params.medModalValue = medModalValue.toString();
  if (weaponModalValue !== undefined) params.weaponModalValue = weaponModalValue.toString();

  return await apiCall('/modal', params);
};

// lookup unit by uic code
export const getUsersUIC = async (uic) => {
  return await apiCall('/users/uic', { uic });
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
        medicalReadinessScore: true
      })
    ]);

    return {
      snapshot,
      priority,
      kpi
    };
  } catch (error) {
    console.error('Failed to fetch all readiness data:', error);
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
    weaponModalValue: true
  });
};

// gets recommendations for specific priority items
export const getRecommendations = async (unit, priorityItem) => {
  const params = { unit };
  if (priorityItem) {
    params.priorityItem = priorityItem;
  }
  return await apiCall('/recommendations', params);
};