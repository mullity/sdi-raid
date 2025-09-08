import KPICard from '../components/KPIcard'
import TrendChart from '../components/TrendChart'
import PrioritiesPanel from '../components/PrioritiesPannel'
import './Dashboard.css'

export default function Dashboard() {
  const sampleTrendData = [
    { label: 'Jan', value: 85 },
    { label: 'Feb', value: 88 },
    { label: 'Mar', value: 82 },
    { label: 'Apr', value: 90 },
    { label: 'May', value: 87 },
    { label: 'Jun', value: 92 }
  ]

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
        <TrendChart 
          title="Overall Readiness Trend" 
          data={sampleTrendData}
          height={250}
        />
        <PrioritiesPanel />
      </div>
    </div>
  );
}
