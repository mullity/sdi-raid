import { useState, useEffect } from 'react';
import KPICard from '../components/KPIcard';
import PrioritiesPanel from '../components/PrioritiesPannel';
import PriorityTrendAnalysis from '../components/PriorityTrendAnalysis';
import { getKPI, getSnapshot, getPriority, getAllReadinessData, getUsersUIC } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  // Keep track of which category the user clicked on
  var [selectedCategory, setSelectedCategory] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [snapshotData, setSnapshotData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unit selection state
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loadingUnits, setLoadingUnits] = useState(true);

  // Parent UIC selection state
  const [parentUICs] = useState(['WAMZAA']); // Add more parent UICs as needed
  const [selectedParentUIC, setSelectedParentUIC] = useState('WAMZAA');

  // Default unit ID - could be passed as prop or from context
  const defaultUnit = 1;

  // Fetch units when parent UIC changes
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        setSelectedUnit(null); // Reset selected unit when parent changes

        // Fetch units using selected parent UIC
        const unitsData = await getUsersUIC(selectedParentUIC);
        setUnits(unitsData || []);

        // Set default selected unit to the first one or find a suitable default
        if (unitsData && unitsData.length > 0) {
          const defaultSelectedUnit = unitsData.find(unit => unit.id === defaultUnit) || unitsData[0];
          setSelectedUnit(defaultSelectedUnit);
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
    }
  }, [selectedParentUIC]);

  // Fetch dashboard data when selected unit changes
  useEffect(() => {
    if (!selectedUnit) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the selected unit's ID for fetching data
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

        // Fallback to individual API calls if the combined call fails
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


  // Different priority items for each category
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
      { id: 2, title: 'PT Test Preparation', priority: 'High', dueDate: '2025-09-17', description: 'Conduct ACFT practice and remedial training' },
      { id: 3, title: 'Mission Essential Training', priority: 'Medium', dueDate: '2025-09-22', description: 'Complete METL task certifications' }
    ],
    medical: [
      { id: 1, title: 'Medical Screening Update', priority: 'High', dueDate: '2025-09-11', description: 'Complete annual medical screening requirements' },
      { id: 2, title: 'Immunization Records', priority: 'High', dueDate: '2025-09-14', description: 'Verify and update immunization records' },
      { id: 3, title: 'Dental Readiness', priority: 'Medium', dueDate: '2025-09-19', description: 'Schedule and complete dental examinations' }
    ]
  }

  // Function to handle when user clicks on a KPI card
  function handleKPIClick(category) {
    setSelectedCategory(category);
  }

  // Function to handle parent UIC selection change
  function handleParentUICChange(event) {
    setSelectedParentUIC(event.target.value);
  }

  // Function to handle unit selection change
  function handleUnitChange(event) {
    const unitId = parseInt(event.target.value);
    const unit = units.find(u => u.id === unitId);
    setSelectedUnit(unit);
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
        />
      </div>

      <PriorityTrendAnalysis />
    </div>
  );
}

export default Dashboard;
