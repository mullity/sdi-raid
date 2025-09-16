import { useState, useEffect } from 'react';
import { getSnapshot, getPriority, getKPI, getModal, getUsersUIC } from '../services/api';

// Custom hook for managing unit readiness data
export const useUnitData = (unitId, options = {}) => {
  const [data, setData] = useState({
    snapshot: [],
    priority: [],
    kpi: [],
    modal: [],
    uic: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    includeSnapshot = true,
    includePriority = true,
    includeKPI = true,
    includeModal = false,
    includeUIC = false,
    kpiOptions = {},
    modalOptions = {},
    verbose = false
  } = options;

  const fetchUnitData = async (unit = unitId) => {
    if (!unit) return;

    try {
      setLoading(true);
      setError(null);

      const promises = [];
      const keys = [];

      if (includeSnapshot) {
        promises.push(getSnapshot(unit, verbose));
        keys.push('snapshot');
      }

      if (includePriority) {
        promises.push(getPriority(unit, verbose));
        keys.push('priority');
      }

      if (includeKPI) {
        promises.push(getKPI(unit, kpiOptions));
        keys.push('kpi');
      }

      if (includeModal) {
        promises.push(getModal(unit, modalOptions));
        keys.push('modal');
      }

      if (includeUIC && typeof unit === 'string') {
        promises.push(getUsersUIC(unit));
        keys.push('uic');
      }

      const results = await Promise.allSettled(promises);

      const newData = { ...data };
      results.forEach((result, index) => {
        const key = keys[index];
        if (result.status === 'fulfilled') {
          newData[key] = result.value || [];
        } else {
          console.error(`Failed to fetch ${key} data:`, result.reason);
        }
      });

      setData(newData);

    } catch (err) {
      console.error('Error fetching unit data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, [unitId]);

  return {
    data,
    loading,
    error,
    refetch: fetchUnitData,
    // Individual data accessors
    snapshot: data.snapshot,
    priority: data.priority,
    kpi: data.kpi,
    modal: data.modal,
    uic: data.uic
  };
};

// Hook specifically for KPI data with common options
export const useKPIData = (unitId, options = {}) => {
  return useUnitData(unitId, {
    includeSnapshot: false,
    includePriority: false,
    includeKPI: true,
    kpiOptions: {
      personnelReadinessScore: true,
      equipmentReadinessScore: true,
      trainingReadinessScore: true,
      medicalReadinessScore: true,
      ...options
    }
  });
};

// Hook for modal data with common modal types
export const useModalData = (unitId, modalTypes = {}) => {
  return useUnitData(unitId, {
    includeSnapshot: false,
    includePriority: false,
    includeKPI: false,
    includeModal: true,
    modalOptions: {
      verbose: true,
      vicModalValue: true,
      deploymentModalValue: true,
      ...modalTypes
    }
  });
};