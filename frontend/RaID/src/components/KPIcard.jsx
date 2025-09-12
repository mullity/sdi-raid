import './KPIcard.css';

function KPICard({kpiData={}, onClick }) {
  // Object Unpacking Code
  if (kpiData){
    title = kpiData.id? kpiData.id : 'no id found'
    value = kpiData.value===undefined? 'XXX' : kpiData.value
    valueType = kpiData.valueType===undefined? '' : kpiData.valueType
  }

  //PLACEHOLDER - Dynamic Unit symbol for value
  let unit = ''
  if ( valueType === 'percent'){
    unit = '%'
  }

  let status = 'neutral'
  if (value>=80){
    status = 'good'
  } else if (value <80 && value >=70){
    status = 'warning'
  } else if (value <70 && value >=0){
    status = 'critical'
  }
  //PLACEHOLDER - Trend Value
  let trend = 0
  if (value>=80){
    trend = 1
  } else if (value <80 && value >=70){
    trend = 0
  } else if (value <70 && value >=0){
    trend = -1
  }

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