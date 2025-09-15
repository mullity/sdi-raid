import { useState } from 'react';
import './PrioritiesPannel.css';
import RecommendationsModal from './RecommendationsModal';

function PrioritiesPanel({ priorities = [], selectedCategory }) {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Data from the Leader Hub about readiness
  var leaderHubData = [
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

  // Function to convert leader hub data to priority items
  function convertToPriorityItems(data) {
    return data.map(function(item, index) {
      // Convert status to priority level
      var priority;
      var dueDate;
      
      if (item.status === 'critical') {
        priority = 'High';
        dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 days
      } else if (item.status === 'low') {
        priority = 'High';
        dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 5 days
      } else if (item.status === 'medium') {
        priority = 'Medium';
        dueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 10 days
      } else if (item.status === 'high') {
        priority = 'Low';
        dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 15 days
      } else {
        priority = 'Medium';
        dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days
      }

      var urgencyScore;
      if (item.status === 'critical') {
        urgencyScore = 1;
      } else if (item.status === 'low') {
        urgencyScore = 2;
      } else if (item.status === 'medium') {
        urgencyScore = 3;
      } else {
        urgencyScore = 4;
      }

      return {
        id: index + 1,
        title: item.title,
        priority: priority,
        dueDate: dueDate,
        percentage: item.percentage,
        urgencyScore: urgencyScore
      };
    });
  }

  // Use category-specific priorities if provided, otherwise use leader hub data
  var hubPriorities = convertToPriorityItems(leaderHubData);
  var allItems = priorities.length > 0 ? priorities : hubPriorities;
  
  // Sort items by urgency score and then by percentage
  var items = allItems
    .sort(function(a, b) {
      if (a.urgencyScore !== b.urgencyScore) {
        return a.urgencyScore - b.urgencyScore;
      }
      var aPercentage = a.percentage || 100;
      var bPercentage = b.percentage || 100;
      return aPercentage - bPercentage;
    })
    .slice(0, 3);

  // Function to get the title for the category
  function getCategoryTitle() {
    if (!selectedCategory) {
      return 'Priority Items';
    }

    var categoryTitles = {
      personnel: 'Personnel Readiness Priority Items',
      equipment: 'Equipment Status Priority Items',
      training: 'Training Current Priority Items',
      medical: 'Medical Readiness Priority Items'
    };

    return categoryTitles[selectedCategory] || 'Priority Items';
  }

  // Function to handle view button click
  function handleViewClick(item) {
    setSelectedPriority(item);
    setIsModalOpen(true);
  }

  // Function to close modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedPriority(null);
  }

  return (
    <div className="priorities-panel">
      <h3 className="priorities-title">
        {getCategoryTitle()}
      </h3>
      
      <div className="priorities-list">
        {items.map(function(item) {
          return (
            <div
              key={item.id}
              className={'priority-item priority-' + item.priority.toLowerCase()}
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
                <span className={'priority-badge priority-' + item.priority.toLowerCase()}>
                  {item.priority}
                </span>
                
                <button
                  className="priority-view-button"
                  onClick={() => handleViewClick(item)}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <RecommendationsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        priorityItem={selectedPriority}
      />
    </div>
  );
}

export default PrioritiesPanel;