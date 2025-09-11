import './TopPriorityAreas.css';

function TopPriorityAreas() {
  // Leader Hub readiness data - same as in LeaderHub component
  const readinessCategoriesData = [
    {
      id: 'training',
      title: 'Unit Specific Training',
      description: 'Training readiness and certification status',
      status: 'medium',
      percentage: 76
    },
    {
      id: 'crew',
      title: 'Crew Qualification',
      description: 'Combat Readiness Evaluation Assessment',
      status: 'high',
      percentage: 89
    },
    {
      id: 'deployment',
      title: 'Deployment Readiness',
      description: 'Mission deployment preparation status',
      status: 'critical',
      percentage: 34
    },
    {
      id: 'medical',
      title: 'Medical Readiness',
      description: 'Health and medical certification status',
      status: 'high',
      percentage: 92
    },
    {
      id: 'weapons',
      title: 'Weapons Qualification',
      description: 'Weapons training and marksmanship status',
      status: 'medium',
      percentage: 68
    },
    {
      id: 'vehicle',
      title: 'Vehicle Readiness',
      description: 'Equipment and vehicle operational status',
      status: 'low',
      percentage: 45
    }
  ];

  // Sort by lowest percentage (highest priority) and take top 3
  const topPriorityAreas = readinessCategoriesData
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  const getStatusClass = (status) => {
    switch (status) {
      case 'high': return 'status-high';
      case 'medium': return 'status-medium';
      case 'low': return 'status-low';
      case 'critical': return 'status-critical';
      default: return 'status-unknown';
    }
  };

  return (
    <div className="top-priority-areas">
      <h3 className="priority-areas-title">
        Top Priority Areas
      </h3>
      
      <div className="priority-areas-grid">
        {topPriorityAreas.map((area, index) => (
          <div
            key={area.id}
            className={`priority-area-card ${getStatusClass(area.status)}`}
          >
            <div className="priority-rank">#{index + 1}</div>
            
            <div className="area-header">
              <span className="area-percentage">{area.percentage}%</span>
            </div>
            
            <h4 className="area-title">{area.title}</h4>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${area.percentage}%` }}
              ></div>
            </div>

            <div className="area-description">
              {area.description}
            </div>

            <div className="status-indicator">
              <span className={`status-dot ${getStatusClass(area.status)}`}></span>
              <span className="status-text">
                {area.status.charAt(0).toUpperCase() + area.status.slice(1)} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPriorityAreas;