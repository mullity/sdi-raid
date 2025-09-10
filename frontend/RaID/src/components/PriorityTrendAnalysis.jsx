import { useState } from 'react';
import './PriorityTrendAnalysis.css';

function PriorityTrendAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data for the top 3 priority areas that need attention
  const priorityData = [
    {
      id: 1,
      title: 'Deployment Readiness',
      currentValue: 34,
      status: 'critical',
      trend: -8,
      trendDirection: 'down',
      description: 'Mission deployment preparation requires immediate attention',
      monthlyData: [42, 38, 36, 34],
      recommendations: [
        'Schedule additional deployment training exercises',
        'Review equipment deployment status',
        'Coordinate with logistics for supply readiness'
      ]
    },
    {
      id: 2,
      title: 'Vehicle Readiness', 
      currentValue: 45,
      status: 'low',
      trend: -5,
      trendDirection: 'down',
      description: 'Equipment and vehicle operational status below standards',
      monthlyData: [52, 48, 47, 45],
      recommendations: [
        'Increase preventive maintenance schedules',
        'Address parts supply chain issues',
        'Conduct vehicle inspection audits'
      ]
    },
    {
      id: 3,
      title: 'Weapons Qualification',
      currentValue: 68,
      status: 'medium',
      trend: -4,
      trendDirection: 'down', 
      description: 'Weapons training and marksmanship needs improvement',
      monthlyData: [74, 71, 69, 68],
      recommendations: [
        'Schedule additional range time',
        'Implement marksmanship improvement programs',
        'Review weapons maintenance procedures'
      ]
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'critical': return 'status-critical';
      case 'low': return 'status-low';
      case 'medium': return 'status-medium';
      case 'high': return 'status-high';
      default: return 'status-unknown';
    }
  };

  const getTrendIcon = (direction) => {
    return direction === 'up' ? '↗' : '↘';
  };

  return (
    <div className="priority-trend-analysis">
      <div className="analysis-header">
        <h3 className="analysis-title">Top 3 Priority Areas - Trend Analysis</h3>
        <div className="timeframe-selector">
          <button 
            className={`timeframe-btn ${selectedTimeframe === '7d' ? 'active' : ''}`}
            onClick={() => setSelectedTimeframe('7d')}
          >
            7D
          </button>
          <button 
            className={`timeframe-btn ${selectedTimeframe === '30d' ? 'active' : ''}`}
            onClick={() => setSelectedTimeframe('30d')}
          >
            30D
          </button>
          <button 
            className={`timeframe-btn ${selectedTimeframe === '90d' ? 'active' : ''}`}
            onClick={() => setSelectedTimeframe('90d')}
          >
            90D
          </button>
        </div>
      </div>

      <div className="priorities-grid">
        {priorityData.map((priority, index) => (
          <div key={priority.id} className={`priority-card ${getStatusClass(priority.status)}`}>
            <div className="priority-header">
              <div className="priority-rank">#{index + 1}</div>
              <div className="priority-info">
                <h4 className="priority-title">{priority.title}</h4>
                <p className="priority-description">{priority.description}</p>
              </div>
              <div className="priority-metrics">
                <div className="current-value">{priority.currentValue}%</div>
                <div className={`trend-indicator trend-${priority.trendDirection}`}>
                  {getTrendIcon(priority.trendDirection)} {Math.abs(priority.trend)}%
                </div>
              </div>
            </div>

            <div className="trend-visualization">
              <div className="mini-chart">
                {priority.monthlyData.map((value, idx) => (
                  <div 
                    key={idx} 
                    className="chart-bar"
                    style={{ height: `${(value / 100) * 40}px` }}
                    title={`Month ${idx + 1}: ${value}%`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="recommendations">
              <h5 className="recommendations-title">Recommended Actions:</h5>
              <ul className="recommendations-list">
                {priority.recommendations.slice(0, 2).map((rec, idx) => (
                  <li key={idx} className="recommendation-item">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriorityTrendAnalysis;