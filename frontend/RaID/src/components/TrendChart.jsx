import './TrendChart.css'

function TrendChart({ title, data, height = 200 }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((maxValue - item.value) / range) * 80 + 10
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="trend-chart">
      <h3 className="chart-title">
        {title}
      </h3>
      
      <div className="chart-container" style={{ height: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          className="chart-svg"
        >
          <polyline
            points={points}
            className="chart-line"
          />
          
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = ((maxValue - item.value) / range) * 80 + 10
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                className="chart-point"
              />
            )
          })}
        </svg>
        
        <div className="chart-labels">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
      
      <div className="chart-stats">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  )
}

export default TrendChart