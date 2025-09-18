import './ReadinessModal.css';

function ReadinessModal({ category }) {
   const getStatusClass = (percentage) => {
  //   switch (status) {
  //     case 'high': return 'status-high';
  //     case 'medium': return 'status-medium';
  //     case 'low': return 'status-low';
  //     case 'critical': return 'status-critical';
  //     default: return 'status-unknown';
  //   }

  if(percentage >= 90){
      return 'status-high'
    }
    else if(percentage >= 80){
      return 'status-medium'
    }
    else if(percentage >= 70){
      return 'status-low'
    }
    else if(percentage){
      return 'status-critical'
    } else {
      return 'status-unknown'
    }
  };

  console.log(category)

  const getStatusLabel = (value) => {
    let status = getStatusClass(value)
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Placeholder data for the modal content


  return (
    <div className="readiness-modal">
      <div className="modal-summary">
        <div className="summary-header">
          <div className="summary-percentage">{category.percentage}%</div>
          <div className={`summary-status ${getStatusClass(category.percentage)}`}>
            {getStatusLabel(category.status)} Priority
          </div>
        </div>
        <p className="summary-description">{category.description}</p>
      </div>

      <div className="modal-metrics">
        <h3 className="section-title">Key Metrics</h3>
        <div className="metrics-grid">
          {category.data.metrics.map((metric, index) => (
            <div key={index} className={`metric-card ${getStatusClass(metric.value)}`}>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-issues">
        <h3 className="section-title">Current Issues</h3>
        <ul className="issues-list">
          {category.data.issues.map((issue, index) => (
            <li key={index} className="issue-item">{issue.text}</li>
          ))}
        </ul>
      </div>

      <div className="modal-actions">
        <h3 className="section-title">Recommended Actions</h3>
        <div className="actions-list">
          {category.data.actions.map((action, index) => (
            <div key={index} className="action-item">
              <div className="action-priority">Priority {index + 1}</div>
              <div className="action-text">{action.text}</div>
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