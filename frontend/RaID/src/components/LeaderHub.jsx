import { useState } from 'react';
import Modal from './Modal';
import ReadinessModal from './ReadinessModal';
import './LeaderHub.css';

function LeaderHub({ selectedUnit }) {
  // Keep track of which category the user is hovering over
  var hoveredCategory = useState(null)[0];
  var setHoveredCategory = useState(null)[1];
  
  // Keep track of which category the user selected
  var selectedCategory = useState(null)[0];
  var setSelectedCategory = useState(null)[1];
  
  // Keep track of whether the modal is open or closed
  var isModalOpen = useState(false)[0];
  var setIsModalOpen = useState(false)[1];

  // Data about different readiness categories
  var readinessCategoriesData = [
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

  // Sort categories from lowest to highest percentage
  var readinessCategories = readinessCategoriesData.sort(function(a, b) {
    return a.percentage - b.percentage;
  });

  // Function to get the right CSS class for a status
  function getStatusClass(status) {
    if (status === 'high') {
      return 'status-high';
    } else if (status === 'medium') {
      return 'status-medium';
    } else if (status === 'low') {
      return 'status-low';
    } else if (status === 'critical') {
      return 'status-critical';
    } else {
      return 'status-unknown';
    }
  }

  // Function to handle when user clicks on a category
  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }

  // Function to handle when user closes the modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedCategory(null);
  }

  return (
    <div className="leader-hub">
      <div className="hub-header">
        <h3 className="hub-title">Leader Hub</h3>
        {selectedUnit && (
          <div className="selected-unit">
            <span className="unit-label">Selected Unit:</span>
            <span className="unit-name">{selectedUnit.name}</span>
            <span className="unit-uic">{selectedUnit.uic}</span>
          </div>
        )}
      </div>

      <div className="readiness-grid">
        {readinessCategories.map(function(category) {
          return (
            <div
              key={category.id}
              className={'readiness-box ' + getStatusClass(category.status)}
              onClick={function() {
                handleCategoryClick(category);
              }}
              onMouseEnter={function() {
                setHoveredCategory(category.id);
              }}
              onMouseLeave={function() {
                setHoveredCategory(null);
              }}
            >
            <div className="box-header">
              <span className="box-percentage">{category.percentage}%</span>
            </div>
            
            <h4 className="box-title">{category.title}</h4>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: category.percentage + '%' }}
              ></div>
            </div>

            {hoveredCategory === category.id && (
              <div className="box-tooltip">
                {category.description}
              </div>
            )}

            <div className="status-indicator">
              <span className={'status-dot ' + getStatusClass(category.status)}></span>
              <span className="status-text">
                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
              </span>
            </div>
          </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory?.title || 'Readiness Details'}
      >
        {selectedCategory && (
          <ReadinessModal category={selectedCategory} />
        )}
      </Modal>
    </div>
  );
}

export default LeaderHub;