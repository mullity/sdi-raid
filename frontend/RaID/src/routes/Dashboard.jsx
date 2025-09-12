import { useState } from 'react';
import KPICard from '../components/KPIcard';
import PrioritiesPanel from '../components/PrioritiesPannel';
import PriorityTrendAnalysis from '../components/PriorityTrendAnalysis';
import './Dashboard.css';

function Dashboard() {
  // Keep track of which category the user clicked on
  var [selectedCategory, setSelectedCategory] = useState(null);
  const [kpiData, setKpiData] = useState([])

   useEffect(() => {
    fetch(`http://localhost:3001/kpi`).then(res=>res.json().then(jsonbody=>setKpiData(jsonbody)))
  },[])

  console.log(kpiData)


  // Different priority items for each category
  var categoryPriorityItems = {
    personnel: [
      { id: 1, title: 'Personnel Accountability', priority: 'High', dueDate: '2025-09-12', description: 'Complete personnel roster verification and accountability' },
      { id: 2, title: 'Medical Readiness Review', priority: 'High', dueDate: '2025-09-15', description: 'Update MEDPROS and medical records' },
      { id: 3, title: 'Training Records Update', priority: 'Medium', dueDate: '2025-09-18', description: 'Verify and update individual training records' }
    ],
    equipment: [
      { id: 1, title: 'Equipment Maintenance', priority: 'High', dueDate: '2025-09-14', description: 'Complete preventive maintenance checks' },
      { id: 2, title: 'Supply Inventory', priority: 'High', dueDate: '2025-09-16', description: 'Conduct 100% sensitive items inventory' },
      { id: 3, title: 'Vehicle Inspection', priority: 'Medium', dueDate: '2025-09-20', description: 'Complete quarterly vehicle safety inspections' }
    ],
    training: [
      { id: 1, title: 'Weapons Qualification', priority: 'High', dueDate: '2025-09-13', description: 'Schedule and complete weapons qualification training' },
      { id: 2, title: 'PT Test Preparation', priority: 'High', dueDate: '2025-09-17', description: 'Conduct ACFT practice and remedial training' },
      { id: 3, title: 'Mission Essential Training', priority: 'Medium', dueDate: '2025-09-22', description: 'Complete METL task certifications' }
    ],
    medical: [
      { id: 1, title: 'Medical Screening Update', priority: 'High', dueDate: '2025-09-11', description: 'Complete annual medical screening requirements' },
      { id: 2, title: 'Immunization Records', priority: 'High', dueDate: '2025-09-14', description: 'Verify and update immunization records' },
      { id: 3, title: 'Dental Readiness', priority: 'Medium', dueDate: '2025-09-19', description: 'Schedule and complete dental examinations' }
    ]
  }

  // Function to handle when user clicks on a KPI card
  function handleKPIClick(category) {
    setSelectedCategory(category);
  }

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">
        Unit Readiness Dashboard
      </h2>
      
      <div className="kpi-grid">
        <KPICard 
          title="Personnel Readiness" 
          value="87" 
          unit="%" 
          trend={2} 
          status="good" 
          onClick={function() {
            handleKPIClick('personnel');
          }}
        />
        <KPICard 
          title="Equipment Status" 
          value="92" 
          unit="%" 
          trend={-1} 
          status="warning" 
          onClick={function() {
            handleKPIClick('equipment');
          }}
        />
        <KPICard 
          title="Training Current" 
          value="78" 
          unit="%" 
          trend={5} 
          status="critical" 
          onClick={function() {
            handleKPIClick('training');
          }}
        />
        <KPICard 
          title="Medical Readiness" 
          value="94" 
          unit="%" 
          trend={0} 
          status="good" 
          onClick={function() {
            handleKPIClick('medical');
          }}
        />
      </div>

      <div className="dashboard-content">
        <PrioritiesPanel 
          priorities={selectedCategory ? categoryPriorityItems[selectedCategory] : []}
          selectedCategory={selectedCategory}
        />
      </div>

      <PriorityTrendAnalysis />
    </div>
  );
}

export default Dashboard;
