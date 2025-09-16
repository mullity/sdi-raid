const BASE_URL = 'http://localhost:3001';

// Generic API call function with error handling
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

// GET: Snapshot - Unit readiness snapshot data
export const getSnapshot = async (unit, verbose = null) => {
  const params = { unit };
  if (verbose !== null) params.verbose = verbose.toString();

  return await apiCall('/snapshot', params);
};

// GET: KPI - Key Performance Indicators with optional filters
export const getKPI = async (unit, options = {}) => {
  const params = { unit };

  // Add optional parameters
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

// GET: Priority - Same as snapshot but ordered by value lowest first
export const getPriority = async (unit, verbose = null) => {
  const params = { unit };
  if (verbose !== null) params.verbose = verbose.toString();

  return await apiCall('/priority', params);
};

// GET: Modal - Detailed modal information
export const getModal = async (unit, options = {}) => {
  const params = { unit };

  // Add optional parameters
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

// GET: Users/UIC - Get unit information by UIC
export const getUsersUIC = async (uic) => {
  return await apiCall('/users/uic', { uic });
};

// Convenience functions for specific use cases
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