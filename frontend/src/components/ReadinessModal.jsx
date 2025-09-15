import './ReadinessModal.css';

function ReadinessModal({ category }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'high': return 'status-high';
      case 'medium': return 'status-medium';
      case 'low': return 'status-low';
      case 'critical': return 'status-critical';
      default: return 'status-unknown';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Placeholder data for the modal content
  const getModalContent = (categoryId) => {
    const contentMap = {
      'deployment': {
        metrics: [
          { label: 'Personnel Ready', value: '45%', status: 'critical' },
          { label: 'Equipment Staged', value: '23%', status: 'critical' },
          { label: 'Transport Available', value: '67%', status: 'medium' },
          { label: 'Mission Planning', value: '12%', status: 'critical' }
        ],
        issues: [
          'Insufficient personnel with current deployment certifications',
          'Critical equipment maintenance backlog',
          'Limited transport capacity for full deployment',
          'Incomplete mission planning documentation'
        ],
        actions: [
          'Schedule emergency deployment training for all personnel',
          'Prioritize critical equipment maintenance and repairs',
          'Coordinate with transportation units for additional capacity',
          'Complete mission planning documentation by end of week'
        ]
      },
      'vehicle': {
        metrics: [
          { label: 'Operational Vehicles', value: '45%', status: 'low' },
          { label: 'Maintenance Current', value: '32%', status: 'critical' },
          { label: 'Fuel Readiness', value: '78%', status: 'medium' },
          { label: 'Driver Certification', value: '89%', status: 'high' }
        ],
        issues: [
          '55% of vehicles are non-operational due to maintenance issues',
          'Parts supply chain delays affecting repair timelines',
          'Maintenance staff shortage impacting service schedules',
          'Aging fleet requiring increased maintenance frequency'
        ],
        actions: [
          'Implement emergency maintenance schedule for critical vehicles',
          'Expedite parts ordering and establish backup suppliers',
          'Cross-train additional personnel for maintenance duties',
          'Develop fleet replacement and modernization plan'
        ]
      },
      'weapons': {
        metrics: [
          { label: 'Qualified Personnel', value: '68%', status: 'medium' },
          { label: 'Range Time Current', value: '45%', status: 'low' },
          { label: 'Equipment Status', value: '82%', status: 'high' },
          { label: 'Safety Certification', value: '95%', status: 'high' }
        ],
        issues: [
          '32% of personnel require weapons qualification updates',
          'Limited range time availability affecting training schedules',
          'Ammunition allocation constraints limiting practice sessions',
          'Weather delays impacting outdoor training activities'
        ],
        actions: [
          'Schedule additional range time for qualification training',
          'Coordinate with ammunition supply for increased allocation',
          'Implement indoor training simulators for weather contingencies',
          'Prioritize qualification training for deployment-ready personnel'
        ]
      },
      'training': {
        metrics: [
          { label: 'Unit Training Complete', value: '76%', status: 'medium' },
          { label: 'Individual Skills', value: '83%', status: 'high' },
          { label: 'Leadership Training', value: '65%', status: 'medium' },
          { label: 'Specialty Training', value: '58%', status: 'low' }
        ],
        issues: [
          '24% of unit-specific training modules remain incomplete',
          'Specialty training programs experiencing resource constraints',
          'Leadership development courses have scheduling conflicts',
          'Training documentation and record-keeping needs improvement'
        ],
        actions: [
          'Complete remaining unit-specific training modules by month end',
          'Allocate additional resources for specialty training programs',
          'Reschedule leadership courses to avoid conflicts',
          'Digitize training records for better tracking and reporting'
        ]
      },
      'crew': {
        metrics: [
          { label: 'Combat Ready', value: '89%', status: 'high' },
          { label: 'Team Cohesion', value: '92%', status: 'high' },
          { label: 'Equipment Proficiency', value: '85%', status: 'high' },
          { label: 'Mission Rehearsals', value: '78%', status: 'medium' }
        ],
        issues: [
          'Minor gaps in crew coordination during complex operations',
          'New personnel integration taking longer than expected',
          'Equipment familiarity varies among crew members',
          'Limited time for full mission rehearsal scenarios'
        ],
        actions: [
          'Conduct additional crew coordination exercises',
          'Implement mentorship program for new personnel integration',
          'Standardize equipment training across all crew members',
          'Schedule comprehensive mission rehearsal sessions'
        ]
      },
      'medical': {
        metrics: [
          { label: 'Medical Readiness', value: '92%', status: 'high' },
          { label: 'Vaccinations Current', value: '98%', status: 'high' },
          { label: 'Physical Fitness', value: '87%', status: 'high' },
          { label: 'Medical Equipment', value: '94%', status: 'high' }
        ],
        issues: [
          '8% of personnel have pending medical evaluations',
          'Minor equipment calibration requirements outstanding',
          'Annual physical fitness assessments need completion',
          'Medical supply inventory requires routine replenishment'
        ],
        actions: [
          'Complete pending medical evaluations within two weeks',
          'Schedule equipment calibration with medical support',
          'Finish remaining physical fitness assessments',
          'Coordinate with supply for medical inventory replenishment'
        ]
      }
    };

    return contentMap[categoryId] || {
      metrics: [],
      issues: ['No specific data available for this category'],
      actions: ['Contact system administrator for detailed information']
    };
  };

  const content = getModalContent(category.id);

  return (
    <div className="readiness-modal">
      <div className="modal-summary">
        <div className="summary-header">
          <div className="summary-percentage">{category.percentage}%</div>
          <div className={`summary-status ${getStatusClass(category.status)}`}>
            {getStatusLabel(category.status)} Priority
          </div>
        </div>
        <p className="summary-description">{category.description}</p>
      </div>

      <div className="modal-metrics">
        <h3 className="section-title">Key Metrics</h3>
        <div className="metrics-grid">
          {content.metrics.map((metric, index) => (
            <div key={index} className={`metric-card ${getStatusClass(metric.status)}`}>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-issues">
        <h3 className="section-title">Current Issues</h3>
        <ul className="issues-list">
          {content.issues.map((issue, index) => (
            <li key={index} className="issue-item">{issue}</li>
          ))}
        </ul>
      </div>

      <div className="modal-actions">
        <h3 className="section-title">Recommended Actions</h3>
        <div className="actions-list">
          {content.actions.map((action, index) => (
            <div key={index} className="action-item">
              <div className="action-priority">Priority {index + 1}</div>
              <div className="action-text">{action}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-footer">
        <div className="last-updated">
          Last Updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </div>
        <div className="placeholder-notice">
          <strong>Note:</strong> This is placeholder data for demonstration purposes.
        </div>
      </div>
    </div>
  );
}

export default ReadinessModal;