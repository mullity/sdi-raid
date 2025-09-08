import './KPIcard.css'

function KPICard({ title, value, unit, trend, status = 'neutral' }) {

  const getTrendIcon = () => {
    if (trend > 0) return '↗'
    if (trend < 0) return '↘'
    return '→'
  }

  const getTrendClass = () => {
    if (trend > 0) return 'trend-up'
    if (trend < 0) return 'trend-down'
    return 'trend-neutral'
  }

  return (
    <div className={`kpi-card status-${status}`}>
      <h3 className="kpi-title">
        {title}
      </h3>
      
      <div className="kpi-content">
        <div>
          <span className={`kpi-value status-${status}`}>
            {value}
          </span>
          {unit && (
            <span className="kpi-unit">
              {unit}
            </span>
          )}
        </div>
        
        {trend !== undefined && (
          <div className={`kpi-trend ${getTrendClass()}`}>
            {getTrendIcon()}
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard