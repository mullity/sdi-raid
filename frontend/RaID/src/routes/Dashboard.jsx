import KPICard from '../components/KPIcard'
import PrioritiesPanel from '../components/PrioritiesPannel'
import PriorityTrendAnalysis from '../components/PriorityTrendAnalysis'
import './Dashboard.css'

export default function Dashboard() {

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
        />
        <KPICard 
          title="Equipment Status" 
          value="92" 
          unit="%" 
          trend={-1} 
          status="warning" 
        />
        <KPICard 
          title="Training Current" 
          value="78" 
          unit="%" 
          trend={5} 
          status="critical" 
        />
        <KPICard 
          title="Medical Readiness" 
          value="94" 
          unit="%" 
          trend={0} 
          status="good" 
        />
      </div>

      <div className="dashboard-content">
        <PrioritiesPanel />
      </div>

      <PriorityTrendAnalysis />
    </div>
  );
}
