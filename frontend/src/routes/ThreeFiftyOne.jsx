import KPICard from '../components/KPIcard'
import PrioritiesPanel from '../components/PrioritiesPannel'
import './ThreeFiftyOne.css'

export default function ThreeFiftyOne() {
  const armyTrainingPriorities = [
    { id: 1, title: 'Weapons Qualification', priority: 'High', dueDate: '2025-09-20' },
    { id: 2, title: 'Physical Fitness Test', priority: 'Medium', dueDate: '2025-09-30' },
    { id: 3, title: 'First Aid Certification', priority: 'High', dueDate: '2025-09-15' },
    { id: 4, title: 'Leadership Training', priority: 'Low', dueDate: '2025-10-10' }
  ]

  return (
    <div className="threefiftyone-page">
      <h2 className="threefiftyone-title">
        Army Training Requirements (350-1)
      </h2>
      
      <div className="threefiftyone-kpi-grid">
        <KPICard 
          title="Individual Training" 
          value="82" 
          unit="%" 
          trend={3} 
          status="warning" 
        />
        <KPICard 
          title="Collective Training" 
          value="89" 
          unit="%" 
          trend={1} 
          status="good" 
        />
        <KPICard 
          title="Leader Development" 
          value="76" 
          unit="%" 
          trend={-2} 
          status="critical" 
        />
        <KPICard 
          title="Training Resources" 
          value="91" 
          unit="%" 
          trend={0} 
          status="good" 
        />
      </div>

      <div className="threefiftyone-content">
        <PrioritiesPanel priorities={armyTrainingPriorities} />
      </div>
    </div>
  );
}