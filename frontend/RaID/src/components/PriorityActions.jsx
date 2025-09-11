import './PriorityActions.css';

function PriorityActions() {
  const priorityActions = [
    {
      id: 1,
      title: "Establish Accountability",
      tasks: [
        {
          name: "Inventory and Sign for Property",
          description: "Conduct a 100% sensitive items inventory and verify your property book. Lock down accountability early—it sets the tone."
        },
        {
          name: "Update Personnel Roster",
          description: "Validate your unit's manning roster, duty status, and personnel files. Know exactly who you have and where they are."
        }
      ]
    },
    {
      id: 2,
      title: "Build the Team",
      tasks: [
        {
          name: "Initial Counseling",
          description: "Sit down with your First Sergeant, platoon leaders, and key staff NCOs. Set expectations clearly in writing."
        },
        {
          name: "Command Philosophy",
          description: "Publish and brief your philosophy so everyone knows your priorities, leadership style, and standards."
        },
        {
          name: "Meet Families",
          description: "Engage the Family Readiness Group (FRG) or equivalent—families are part of the mission."
        }
      ]
    },
    {
      id: 3,
      title: "Set Training Priorities",
      tasks: [
        {
          name: "Assess Training Level",
          description: "Review current training status (weapons qualification, APFT/ACFT, mandatory training, METL tasks)."
        },
        {
          name: "Publish a Training Guidance",
          description: "Issue your initial training guidance that aligns with battalion's mission and your company's needs."
        },
        {
          name: "Lock in a Calendar",
          description: "Work with the XO and 1SG to set a 90-day training calendar. Protect it from \"death by tasking.\""
        }
      ]
    },
    {
      id: 4,
      title: "Sustain Readiness",
      tasks: [
        {
          name: "Maintenance Battle Rhythm",
          description: "Establish weekly maintenance meetings and motor pool checks with your XO and motor sergeant."
        },
        {
          name: "Medical and Admin Readiness",
          description: "Track MEDPROS, family care plans, DTS, and security clearances."
        },
        {
          name: "Mission Rehearsals",
          description: "Run rehearsals for major training events, ranges, and deployments."
        }
      ]
    },
    {
      id: 5,
      title: "Communicate Up and Down",
      tasks: [
        {
          name: "Battle Rhythm Meetings",
          description: "Participate in battalion meetings, then translate that info to the company."
        },
        {
          name: "Reports",
          description: "Ensure all reports (personnel status, equipment status, training reports) are accurate and timely."
        },
        {
          name: "Command Voice",
          description: "Keep your intent and guidance consistent so there's no confusion in the ranks."
        }
      ]
    }
  ];

  return (
    <div className="priority-actions">
      <h3 className="priority-actions-title">
        Priority Actions
      </h3>
      
      <div className="actions-grid">
        {priorityActions.map((action) => (
          <div key={action.id} className="action-card">
            <div className="action-header">
              <h4 className="action-title">{action.title}</h4>
            </div>
            
            <div className="tasks-list">
              {action.tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-header">
                    <h5 className="task-name">{task.name}:</h5>
                  </div>
                  <p className="task-description">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriorityActions;