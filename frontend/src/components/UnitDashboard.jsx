import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import './UnitDashboard.css';

function UnitDashboard({ unit, onBack }) {
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (unit) {
      loadUnitData();
    }
  }, [unit]);

  const loadUnitData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getCompleteUnitData(unit.uic);
      setUnitData(data);
    } catch (err) {
      setError('Failed to load unit data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="unit-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading unit data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unit-dashboard">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={onBack} className="back-button">← Back to Search</button>
        </div>
      </div>
    );
  }

  if (!unitData) {
    return null;
  }

  const { unit: unitInfo, soldiers, vehicles, readiness, taskStatuses, summary } = unitData;

  const renderOverview = () => (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{summary.totalSoldiers}</div>
          <div className="stat-label">Total Soldiers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.totalVehicles}</div>
          <div className="stat-label">Total Vehicles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.taskQualificationRate}</div>
          <div className="stat-label">Qualification Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{readiness.length}</div>
          <div className="stat-label">Readiness Reports</div>
        </div>
      </div>

      <div className="breakdown-section">
        <div className="breakdown-card">
          <h3>Personnel by Grade</h3>
          <div className="breakdown-grid">
            {Object.entries(summary.soldierGrades).map(([grade, count]) => (
              <div key={grade} className="breakdown-item">
                <span className="grade-badge">{grade}</span>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="breakdown-card">
          <h3>Vehicle Status</h3>
          <div className="vehicle-status">
            {Object.entries(summary.vehicleStatus).map(([status, count]) => (
              <div key={status} className={`status-item status-${status.toLowerCase()}`}>
                <span className="status-label">{status}</span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSoldiers = () => (
    <div className="soldiers-tab">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Unit</th>
              <th>UIC</th>
            </tr>
          </thead>
          <tbody>
            {soldiers.map(soldier => (
              <tr key={soldier.id}>
                <td>{soldier.first_name} {soldier.last_name}</td>
                <td><span className="grade-badge">{soldier.pay_grade}</span></td>
                <td>{soldier.unit_name}</td>
                <td className="uic-cell">{soldier.uic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="vehicles-tab">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>LIN</th>
              <th>Status</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td className="vehicle-name">{vehicle.name}</td>
                <td className="lin-cell">{vehicle.lin}</td>
                <td>
                  <span className={`status-badge status-${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.unit_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="tasks-tab">
      <div className="task-summary">
        <div className="qualified-count">
          Qualified: {taskStatuses.filter(t => t.status === 'qualified').length}
        </div>
        <div className="not-qualified-count">
          Not Qualified: {taskStatuses.filter(t => t.status === 'not_qualified').length}
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Soldier</th>
              <th>Grade</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {taskStatuses.slice(0, 100).map(task => (
              <tr key={task.id}>
                <td>{task.first_name} {task.last_name}</td>
                <td><span className="grade-badge">{task.pay_grade}</span></td>
                <td>{task.task_title}</td>
                <td>
                  <span className={`status-badge ${task.status === 'qualified' ? 'qualified' : 'not-qualified'}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="unit-dashboard">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-button">← Back to Search</button>
        <div className="unit-info">
          <h1>{unitInfo.name}</h1>
          <div className="unit-details">
            <span className="uic">UIC: {unitInfo.uic}</span>
            <span className="id">ID: {unitInfo.id}</span>
          </div>
        </div>
        <button onClick={loadUnitData} className="refresh-button">🔄 Refresh</button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'soldiers' ? 'active' : ''}`}
          onClick={() => setActiveTab('soldiers')}
        >
          Personnel ({soldiers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles ({vehicles.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({taskStatuses.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'soldiers' && renderSoldiers()}
        {activeTab === 'vehicles' && renderVehicles()}
        {activeTab === 'tasks' && renderTasks()}
      </div>
    </div>
  );
}

export default UnitDashboard;