import './PrioritiesPannel.css'

function PrioritiesPanel({ priorities = [] }) {

  const defaultPriorities = [
    { id: 1, title: 'Equipment Maintenance', priority: 'High', dueDate: '2025-09-15' },
    { id: 2, title: 'Training Certification', priority: 'Medium', dueDate: '2025-09-20' },
    { id: 3, title: 'Medical Readiness Review', priority: 'High', dueDate: '2025-09-12' },
    { id: 4, title: 'Supply Inventory', priority: 'Low', dueDate: '2025-09-25' }
  ]

  const items = priorities.length > 0 ? priorities : defaultPriorities

  return (
    <div className="priorities-panel">
      <h3 className="priorities-title">
        Priority Items
      </h3>
      
      <div className="priorities-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`priority-item priority-${item.priority.toLowerCase()}`}
          >
            <div className="priority-content">
              <div className="priority-title">
                {item.title}
              </div>
              <div className="priority-due-date">
                Due: {item.dueDate}
              </div>
            </div>
            
            <div className="priority-actions">
              <span className={`priority-badge priority-${item.priority.toLowerCase()}`}>
                {item.priority}
              </span>
              
              <button className="priority-view-button">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PrioritiesPanel