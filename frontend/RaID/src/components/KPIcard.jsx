import './KPIcard.css';

function KPICard({ title, value, unit, trend, status = 'neutral', onClick }) {

  // Function to get the right arrow for the trend
  function getTrendIcon() {
    if (trend > 0) {
      return '↗';
    }
    if (trend < 0) {
      return '↘';
    }
    return '→';
  }

  // Function to get the right CSS class for the trend
  function getTrendClass() {
    if (trend > 0) {
      return 'trend-up';
    }
    if (trend < 0) {
      return 'trend-down';
    }
    return 'trend-neutral';
  }

  // Create the CSS classes for the card
  var cardClasses = 'kpi-card status-' + status;
  if (onClick) {
    cardClasses = cardClasses + ' clickable';
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      <h3 className="kpi-title">
        {title}
      </h3>
      
      <div className="kpi-content">
        <div>
          <span className={'kpi-value status-' + status}>
            {value}
          </span>
          {unit && (
            <span className="kpi-unit">
              {unit}
            </span>
          )}
        </div>
        
        {trend !== undefined && (
          <div className={'kpi-trend ' + getTrendClass()}>
            {getTrendIcon()}
          </div>
        )}
      </div>
    </div>
  );
}

export default KPICard;