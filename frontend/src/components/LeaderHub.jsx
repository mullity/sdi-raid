import { useState, useEffect } from 'react';
import Modal from './Modal';
import ReadinessModal from './ReadinessModal';
import './LeaderHub.css';
import raidLogo from '../assets/raidlogo.png';

function LeaderHub({ selectedUnit }) {
  // hover state
  var [hoveredCategory, setHoveredCategory] = useState(null);
  const [modalData, setModalData] = useState(null)

  useEffect(()=> {
    fetch('http://localhost:3001/modal?unit=1&vicModalValue=true&deploymentModalValue=true&crewModalValue=true&medModalValue=true&weaponModalValue=true&verbose=true')
    .then(res => res.json())
    .then(data => {

      setModalData(data)
    })
  }, [hoveredCategory])

  // which one is clicked
  var [selectedCategory, setSelectedCategory] = useState(null);

  // modal open/closed
  var [isModalOpen, setIsModalOpen] = useState(false);


  if(modalData === null || modalData === undefined){
    console.log('loading')
  } else {
  var readinessCategoriesData = []
  for(let datum of modalData){
    //low, medium, high, critical
    let status
    if(datum.data.percentage >= 90){
      status = 'high'
    }
    else if(datum.data.percentage >= 80){
      status = 'medium'
    }
    else if(datum.data.percentage >= 70){
      status = 'low'
    }
    else if(datum.data.percentage){
      status = 'critical'
    }

    readinessCategoriesData.push({
      id: datum.id,
      title: datum.data.title,
      description: datum.data.description,
      percentage: Math.floor(datum.data.percentage),
      status: status,
      data: datum.data
    })
  }
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

  if(readinessCategories === undefined || readinessCategories === null){
    return <h1>Loading Leaderhub</h1>
  }else {
    //console.log(readinessCategories, 'leaderhub readiness categories')
  return (
    <div className="leader-hub">
      <div className="hub-header">
        <img src={raidLogo} alt="RAID Logo" className="raid-logo" />
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
              <span className="box-percentage">{Math.round(category.percentage * 100) /100}%</span>
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
                {category.status?.charAt(0).toUpperCase() + category.status?.slice(1)}
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
          <ReadinessModal category={selectedCategory.data}/>
        )}
      </Modal>
    </div>
  );
}
  }
}

export default LeaderHub;