import { useState } from 'react';
import Modal from './Modal';
import ReadinessModal from './ReadinessModal';
import './LeaderHub.css';

function LeaderHub({ selectedUnit }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Sort categories from lowest to highest percentage
  const readinessCategories = readinessCategoriesData.sort((a, b) => a.percentage - b.percentage);

  const getStatusClass = (status) => {
    switch (status) {
      case 'high': return 'status-high';
      case 'medium': return 'status-medium';
      case 'low': return 'status-low';
      case 'critical': return 'status-critical';
      default: return 'status-unknown';
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

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
        {readinessCategories.map((category) => (
          <div
            key={category.id}
            className={`readiness-box ${getStatusClass(category.status)}`}
            onClick={() => handleCategoryClick(category)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="box-header">
              <span className="box-percentage">{category.percentage}%</span>
            </div>
            
            <h4 className="box-title">{category.title}</h4>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>

            {hoveredCategory === category.id && (
              <div className="box-tooltip">
                {category.description}
              </div>
            )}

            <div className="status-indicator">
              <span className={`status-dot ${getStatusClass(category.status)}`}></span>
              <span className="status-text">
                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
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