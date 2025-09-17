import './PrintReport.css';
import KPICard from './KPIcard';

function PrintReport() {
  // Get the same data as TopPriorityAreas component
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

  // Current issues based on low readiness areas
  const currentIssues = [
    {
      area: 'Deployment Readiness',
      percentage: 34,
      issues: [
        'Missing deployment medical records for 12 personnel',
        'Incomplete family care plans for 8 soldiers',
        'Outstanding security clearance renewals for 5 personnel',
        'Equipment shortages affecting deployment capability'
      ]
    },
    {
      area: 'Vehicle Readiness',
      percentage: 45,
      issues: [
        '3 vehicles down for maintenance beyond 30 days',
        'Missing required safety equipment in 2 vehicles',
        'Overdue preventive maintenance on 5 vehicles',
        'Driver training certification expired for 7 personnel'
      ]
    },
    {
      area: 'Weapons Qualification',
      percentage: 68,
      issues: [
        '15 personnel require weapons re-qualification',
        'Range time scheduling conflicts affecting training',
        'Ammunition shortage limiting practice opportunities',
        'Night vision qualification expired for 8 soldiers'
      ]
    }
  ];

  // Recommended actions based on priority areas
  const recommendedActions = [
    {
      priority: 1,
      area: 'Deployment Readiness',
      actions: [
        'Schedule immediate medical appointments for 12 personnel with missing records',
        'Conduct family care plan review and completion sessions within 7 days',
        'Submit emergency security clearance renewal requests to S2',
        'Coordinate with supply to expedite critical equipment procurement',
        'Establish weekly deployment readiness review meetings'
      ]
    },
    {
      priority: 2,
      area: 'Vehicle Readiness',
      actions: [
        'Prioritize maintenance on 3 long-term deadlined vehicles',
        'Conduct immediate safety equipment inventory and procurement',
        'Schedule preventive maintenance for overdue vehicles within 14 days',
        'Organize driver training refresher course for expired personnel',
        'Implement weekly vehicle status tracking system'
      ]
    },
    {
      priority: 3,
      area: 'Weapons Qualification',
      actions: [
        'Schedule range time for 15 personnel requiring re-qualification',
        'Coordinate with range control for priority scheduling',
        'Request additional ammunition allocation from higher headquarters',
        'Plan night vision qualification training within 30 days',
        'Establish monthly weapons qualification tracking review'
      ]
    }
  ];

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="print-report">
      <div className="report-header">
        <h1>Unit Readiness Assessment Report</h1>
        <p className="report-date">Generated: {formatDate()}</p>
        <p className="report-unit">Unit: WAZMB0</p>
      </div>

      <div className="report-section">
        <h2>Readiness Overview</h2>
        <div className="kpi-grid">
          {readinessCategoriesData.map((item, index) => (
            <KPICard
              key={index}
              kpiData={{
                id: item.id,
                value: item.percentage,
                valueType: 'percent',
                data: {
                  title: item.title,
                  description: item.description
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>Top 3 Priority Areas</h2>
        <div className="priority-areas-list">
          {topPriorityAreas.map((area, index) => (
            <div key={area.id} className="priority-item">
              <div className="priority-header">
                <span className="priority-number">#{index + 1}</span>
                <span className="area-name">{area.title}</span>
                <span className="readiness-percentage">{area.percentage}% Ready</span>
              </div>
              <p className="area-description">{area.description}</p>
              <div className="status-badge status-{area.status}">
                {area.status.charAt(0).toUpperCase() + area.status.slice(1)} Priority
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>Current Issues</h2>
        {currentIssues.map((issue, index) => (
          <div key={index} className="issue-block">
            <h3>{issue.area} ({issue.percentage}% Ready)</h3>
            <ul className="issues-list">
              {issue.issues.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="report-section">
        <h2>Recommended Actions</h2>
        <div className="actions-grid">
          {recommendedActions.map((action, index) => (
            <div key={index} className="action-block">
              <h3>Priority {action.priority}: {action.area}</h3>
              <ol className="actions-list">
                {action.actions.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="report-footer">
        <p>This report was generated automatically from the R.A.I.D Dashboard system.</p>
        <p>Next review date: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}</p>
      </div>
    </div>
  );
}

export default PrintReport;