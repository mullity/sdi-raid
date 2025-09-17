import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import KPICard from '../components/KPIcard';
import PrioritiesPanel from '../components/PrioritiesPannel';
import PriorityTrendAnalysis from '../components/PriorityTrendAnalysis';
import { getKPI, getSnapshot, getPriority, getAllReadinessData, getUsersUIC } from '../services/api';
import { getKPI, getSnapshot, getPriority, getAllReadinessData, getUsersUIC } from '../services/api';
import './Dashboard.css';

const STORAGE_KEYS = {
  parentUIC: 'dashboard.parentUIC',
  unitId: 'dashboard.unitId',
};

function Dashboard() {
  const { selectedUIC, setSelectedUIC } = useOutletContext() || {};

  var [selectedCategory, setSelectedCategory] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [snapshotData, setSnapshotData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loadingUnits, setLoadingUnits] = useState(true);

  const [parentUICs] = useState(['WAMZAA']);

  const storedParent = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.parentUIC) : null;
  const [selectedParentUIC, setSelectedParentUIC] = useState(storedParent || 'WAMZAA');

  const defaultUnit = 1;

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        setSelectedUnit(null);

        const unitsData = await getUsersUIC(selectedParentUIC);
        setUnits(unitsData || []);

        let nextUnit = null;

        const storedUnitIdRaw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.unitId) : null;
        const storedUnitId = storedUnitIdRaw ? parseInt(storedUnitIdRaw, 10) : null;

        if (unitsData && unitsData.length > 0) {
          if (storedUnitId && unitsData.some(u => u.id === storedUnitId)) {
            nextUnit = unitsData.find(u => u.id === storedUnitId);
          } else {
            nextUnit = unitsData.find(u => u.id === defaultUnit) || unitsData[0];
          }
        }

        if (nextUnit) {
          setSelectedUnit(nextUnit);
          if (typeof setSelectedUIC === 'function' && nextUnit.uic) {
            setSelectedUIC(nextUnit.uic);
          }
          sessionStorage.setItem(STORAGE_KEYS.unitId, String(nextUnit.id));
        }
      } catch (error) {
        console.error('Failed to fetch units:', error);
        setUnits([]);
      } finally {
        setLoadingUnits(false);
      }
    };

    if (selectedParentUIC) {
      fetchUnits();
      sessionStorage.setItem(STORAGE_KEYS.parentUIC, selectedParentUIC);
    }
  }, [selectedParentUIC, setSelectedUIC]);

  useEffect(() => {
    if (!selectedUnit) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const unitId = selectedUnit.id;
        const data = await getAllReadinessData(unitId);

        setKpiData(data.kpi || []);
        setSnapshotData(data.snapshot || []);
        setPriorityData(data.priority || []);

        console.log('KPI Data:', data.kpi);
        console.log('Snapshot Data:', data.snapshot);
        console.log('Priority Data:', data.priority);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error.message);

        try {
          const kpiResponse = await getKPI(selectedUnit.id, {
            personnelReadinessScore: true,
            equipmentReadinessScore: true,
            trainingReadinessScore: true,
            medicalReadinessScore: true
          });
          setKpiData(kpiResponse || []);
        } catch (fallbackError) {
          console.error('Fallback KPI fetch also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedUnit?.id) {
      sessionStorage.setItem(STORAGE_KEYS.unitId, String(selectedUnit.id));
    }
    if (selectedUnit?.uic && typeof setSelectedUIC === 'function') {
      setSelectedUIC(selectedUnit.uic);
    }
  }, [selectedUnit, setSelectedUIC]);

  var categoryPriorityItems = {
    personnel: [
      { id: 1, title: 'Personnel Accountability', priority: 'High', dueDate: '2025-09-12', description: 'Complete personnel roster verification and accountability' },
      { id: 2, title: 'Medical Readiness Review', priority: 'High', dueDate: '2025-09-15', description: 'Update MEDPROS and medical records' },
      { id: 3, title: 'Training Records Update', priority: 'Medium', dueDate: '2025-09-18', description: 'Verify and update individual training records' }
    ],
    equipment: [
      { id: 1, title: 'Equipment Maintenance', priority: 'High', dueDate: '2025-09-14', description: 'Complete preventive maintenance checks' },
      { id: 2, title: 'Supply Inventory', priority: 'High', dueDate: '2025-09-16', description: 'Conduct 100% sensitive items inventory' },
      { id: 3, title: 'Vehicle Inspection', priority: 'Medium', dueDate: '2025-09-20', description: 'Complete quarterly vehicle safety inspections' }
    ],
    training: [
      { id: 1, title: 'Weapons Qualification', priority: 'High', dueDate: '2025-09-13', description: 'Schedule and complete weapons qualification training' },
      { id: 2, title: 'PT Test Preparation', priority: 'High', dueDate: '2025-09-17', description: 'Conduct AFT practice and remedial training' },
      { id: 3, title: 'Mission Essential Training', priority: 'Medium', dueDate: '2025-09-22', description: 'Complete METL task certifications' }
    ],
    medical: [
      { id: 1, title: 'Medical Screening Update', priority: 'High', dueDate: '2025-09-11', description: 'Complete annual medical screening requirements' },
      { id: 2, title: 'Immunization Records', priority: 'High', dueDate: '2025-09-14', description: 'Verify and update immunization records' },
      { id: 3, title: 'Dental Readiness', priority: 'Medium', dueDate: '2025-09-19', description: 'Schedule and complete dental examinations' }
    ]
  };

  function handleKPIClick(category) {
    setSelectedCategory(category);
  }

  function handleParentUICChange(event) {
    const value = event.target.value;
    setSelectedParentUIC(value);
    sessionStorage.setItem(STORAGE_KEYS.parentUIC, value);
    sessionStorage.removeItem(STORAGE_KEYS.unitId);
  }

  function handleUnitChange(event) {
    const unitId = parseInt(event.target.value, 10);
    const unit = units.find(u => u.id === unitId);
    setSelectedUnit(unit);
    sessionStorage.setItem(STORAGE_KEYS.unitId, String(unitId));
    if (unit?.uic && typeof setSelectedUIC === 'function') {
      setSelectedUIC(unit.uic);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Unit Readiness Dashboard
        </h2>

        <div className="unit-selectors">
          <div className="unit-selector">
            <label htmlFor="parent-uic-dropdown">Parent UIC:</label>
            <select
              id="parent-uic-dropdown"
              value={selectedParentUIC}
              onChange={handleParentUICChange}
              className="unit-dropdown"
            >
              {parentUICs.map(uic => (
                <option key={uic} value={uic}>
                  {uic}
                </option>
              ))}
            </select>
          </div>

          <div className="unit-selector">
            <label htmlFor="unit-dropdown">Select Unit:</label>
            {loadingUnits ? (
              <div className="loading-units">Loading units...</div>
            ) : (
              <select
                id="unit-dropdown"
                value={selectedUnit?.id || ''}
                onChange={handleUnitChange}
                className="unit-dropdown"
                disabled={units.length === 0}
              >
                <option value="" disabled>
                  {units.length === 0 ? 'No units available' : 'Select a unit'}
                </option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.uic} - {unit.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-message">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="error-message">
          Error loading data: {error}
        </div>
      )}

      <div className="kpi-grid">
        {kpiData.length > 0 ? kpiData.filter((item) => (item.value === undefined || item.value === null) ? false : true)
        .map((item, index) => (
          <KPICard
            key={index}
            kpiData={item}
            onClick={function () {
              handleKPIClick(item.id ? item.id : 'noIdFound')
            }}
          />
        )) : !loading && (
          <div className="no-data-message">
            No KPI data available. Make sure the backend is running and connected to the database.
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <PrioritiesPanel
          priorities={selectedCategory ? categoryPriorityItems[selectedCategory] : []}
          selectedCategory={selectedCategory}
          unit={selectedUnit?.id}
        />
      </div>

      <PriorityTrendAnalysis unit={selectedUnit?.id} />
    </div>
  );
}

export default Dashboard;
