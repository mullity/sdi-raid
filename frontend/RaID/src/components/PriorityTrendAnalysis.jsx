import { useState } from 'react';
import './PriorityTrendAnalysis.css';

function PriorityTrendAnalysis() {
  // Keep track of which timeframe is selected
  var selectedTimeframe = useState('30d')[0];
  var setSelectedTimeframe = useState('30d')[1];

  // Data for different time periods
  var priorityDataByTimeframe = {
    '7d': [
      {
        id: 1,
        title: 'Deployment Readiness',
        currentValue: 34,
        status: 'critical',
        trend: -3,
        trendDirection: 'down',
        description: 'Mission deployment preparation requires immediate attention',
        monthlyData: [36, 35, 35, 34, 33, 34, 34], // 7 days
        recommendations: [
          'Conduct emergency deployment drill this week',
          'Verify personnel readiness status',
          'Complete equipment checks immediately'
        ]
      },
      {
        id: 2,
        title: 'Vehicle Readiness', 
        currentValue: 45,
        status: 'low',
        trend: -2,
        trendDirection: 'down',
        description: 'Equipment and vehicle operational status below standards',
        monthlyData: [47, 46, 46, 45, 44, 45, 45], // 7 days
        recommendations: [
          'Schedule immediate vehicle inspections',
          'Address critical maintenance issues',
          'Review parts availability'
        ]
      },
      {
        id: 3,
        title: 'Weapons Qualification',
        currentValue: 68,
        status: 'medium',
        trend: -1,
        trendDirection: 'down', 
        description: 'Weapons training and marksmanship needs improvement',
        monthlyData: [69, 69, 68, 68, 67, 68, 68], // 7 days
        recommendations: [
          'Book range time for this week',
          'Conduct weapon zeroing sessions',
          'Review ammunition supply'
        ]
      }
    ],
    '30d': [
      {
        id: 1,
        title: 'Deployment Readiness',
        currentValue: 34,
        status: 'critical',
        trend: -8,
        trendDirection: 'down',
        description: 'Mission deployment preparation requires immediate attention',
        monthlyData: [42, 38, 36, 34], // 4 weeks
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
        monthlyData: [52, 48, 47, 45], // 4 weeks
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
        monthlyData: [74, 71, 69, 68], // 4 weeks
        recommendations: [
          'Schedule additional range time',
          'Implement marksmanship improvement programs',
          'Review weapons maintenance procedures'
        ]
      }
    ],
    '90d': [
      {
        id: 1,
        title: 'Deployment Readiness',
        currentValue: 34,
        status: 'critical',
        trend: -18,
        trendDirection: 'down',
        description: 'Mission deployment preparation shows concerning long-term decline',
        monthlyData: [52, 48, 44, 40, 38, 36, 34], // 3 months (weekly averages)
        recommendations: [
          'Implement comprehensive deployment readiness program',
          'Conduct quarterly deployment assessment',
          'Establish long-term training partnership with logistics'
        ]
      },
      {
        id: 2,
        title: 'Vehicle Readiness', 
        currentValue: 45,
        status: 'low',
        trend: -15,
        trendDirection: 'down',
        description: 'Vehicle operational status showing sustained deterioration',
        monthlyData: [60, 58, 55, 52, 50, 47, 45], // 3 months (weekly averages)
        recommendations: [
          'Develop quarterly maintenance strategy',
          'Establish vendor partnerships for parts supply',
          'Implement vehicle lifecycle management program'
        ]
      },
      {
        id: 3,
        title: 'Weapons Qualification',
        currentValue: 68,
        status: 'medium',
        trend: -12,
        trendDirection: 'down', 
        description: 'Weapons proficiency declining over extended period',
        monthlyData: [80, 78, 75, 73, 71, 69, 68], // 3 months (weekly averages)
        recommendations: [
          'Establish quarterly marksmanship training cycle',
          'Implement weapons proficiency tracking system',
          'Develop instructor certification program'
        ]
      }
    ]
  };

  // Get current data based on selected timeframe
  var priorityData = priorityDataByTimeframe[selectedTimeframe];

  // Function to get the right CSS class for a status
  function getStatusClass(status) {
    if (status === 'critical') {
      return 'status-critical';
    } else if (status === 'low') {
      return 'status-low';
    } else if (status === 'medium') {
      return 'status-medium';
    } else if (status === 'high') {
      return 'status-high';
    } else {
      return 'status-unknown';
    }
  }

  // Function to get the right arrow for trend direction
  function getTrendIcon(direction) {
    if (direction === 'up') {
      return '↗';
    } else {
      return '↘';
    }
  }

  return (
    <div className="priority-trend-analysis">
      <div className="analysis-header">
        <h3 className="analysis-title">Top 3 Priority Areas - Trend Analysis</h3>
        <div className="timeframe-selector">
          <button 
            className={selectedTimeframe === '7d' ? 'timeframe-btn active' : 'timeframe-btn'}
            onClick={function() {
              setSelectedTimeframe('7d');
            }}
          >
            7D
          </button>
          <button 
            className={selectedTimeframe === '30d' ? 'timeframe-btn active' : 'timeframe-btn'}
            onClick={function() {
              setSelectedTimeframe('30d');
            }}
          >
            30D
          </button>
          <button 
            className={selectedTimeframe === '90d' ? 'timeframe-btn active' : 'timeframe-btn'}
            onClick={function() {
              setSelectedTimeframe('90d');
            }}
          >
            90D
          </button>
        </div>
      </div>

      <div className="priorities-grid">
        {priorityData.map(function(priority, index) {
          return (
            <div key={priority.id} className={'priority-card ' + getStatusClass(priority.status)}>
              <div className="priority-header">
                <div className="priority-rank">#{index + 1}</div>
                <div className="priority-info">
                  <h4 className="priority-title">{priority.title}</h4>
                  <p className="priority-description">{priority.description}</p>
                </div>
                <div className="priority-metrics">
                  <div className="current-value">{priority.currentValue}%</div>
                  <div className={'trend-indicator trend-' + priority.trendDirection}>
                    {getTrendIcon(priority.trendDirection)} {Math.abs(priority.trend)}%
                  </div>
                </div>
              </div>

              <div className="trend-visualization">
                <div className="mini-chart">
                  {priority.monthlyData.map(function(value, idx) {
                    var barHeight = (value / 100) * 40;
                    var barTitle = 'Month ' + (idx + 1) + ': ' + value + '%';
                    return (
                      <div 
                        key={idx} 
                        className="chart-bar"
                        style={{ height: barHeight + 'px' }}
                        title={barTitle}
                      ></div>
                    );
                  })}
                </div>
              </div>

              <div className="recommendations">
                <h5 className="recommendations-title">Recommended Actions:</h5>
                <ul className="recommendations-list">
                  {priority.recommendations.slice(0, 2).map(function(rec, idx) {
                    return (
                      <li key={idx} className="recommendation-item">{rec}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PriorityTrendAnalysis;