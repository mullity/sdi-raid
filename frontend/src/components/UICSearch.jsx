import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import './UICSearch.css';

function UICSearch({ onUnitSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllUnits();
  }, []);

  const loadAllUnits = async () => {
    try {
      setLoading(true);
      const units = await ApiService.getAllUnits();
      
      // Get qualification data for each unit
      const unitsWithStats = await Promise.all(
        units.map(async (unit) => {
          try {
            const completeData = await ApiService.getCompleteUnitData(unit.uic);
            const totalTasks = completeData.taskStatuses.length;
            const qualifiedTasks = completeData.taskStatuses.filter(t => t.status === 'qualified').length;
            const qualificationPercentage = totalTasks > 0 ? Math.round((qualifiedTasks / totalTasks) * 100 * 100) / 100 : 0;
            
            return {
              ...unit,
              total_tasks: totalTasks,
              qualified_tasks: qualifiedTasks,
              qualification_percentage: qualificationPercentage,
              readiness_level: getReadinessLevel(qualificationPercentage)
            };
          } catch (err) {
            console.warn(`Failed to load data for unit ${unit.uic}:`, err);
            return {
              ...unit,
              total_tasks: 0,
              qualified_tasks: 0,
              qualification_percentage: 0,
              readiness_level: 'unknown'
            };
          }
        })
      );
      
      // Sort by qualification percentage (lowest to highest)
      const sortedUnits = unitsWithStats.sort((a, b) => a.qualification_percentage - b.qualification_percentage);
      
      // Add rank
      const rankedUnits = sortedUnits.map((unit, index) => ({
        ...unit,
        rank: index + 1
      }));
      
      setAllUnits(rankedUnits);
      setSearchResults(rankedUnits);
    } catch (err) {
      setError('Failed to load units');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessLevel = (percentage) => {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    if (percentage >= 40) return 'low';
    return 'critical';
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults(allUnits);
      return;
    }

    try {
      setLoading(true);
      const results = await ApiService.searchUnits(term);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
      // Fallback to client-side filtering
      const filtered = allUnits.filter(unit => 
        unit.uic.toLowerCase().includes(term.toLowerCase()) ||
        unit.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitClick = (unit) => {
    onUnitSelect(unit);
  };

  return (
    <div className="uic-search">
      <div className="search-header">
        <h2>Unit Search</h2>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by UIC or unit name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading units...</div>
      ) : (
        <div className="search-results">
          <div className="results-header">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Units Ranked by Readiness'} 
            ({searchResults.length})
          </div>
          
          <div className="readiness-legend">
            <div className="legend-title">Readiness Levels:</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color readiness-high"></div>
                <span>High (80%+)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color readiness-medium"></div>
                <span>Medium (60-79%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color readiness-low"></div>
                <span>Low (40-59%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color readiness-critical"></div>
                <span>Critical (0-39%)</span>
              </div>
            </div>
          </div>
          
          <div className="units-grid">
            {searchResults.map((unit) => (
              <div
                key={unit.id}
                className={`unit-card readiness-${unit.readiness_level || 'unknown'}`}
                onClick={() => handleUnitClick(unit)}
              >
                <div className="unit-header">
                  <div className="unit-rank">#{unit.rank || 'N/A'}</div>
                  <div className={`readiness-badge readiness-${unit.readiness_level || 'unknown'}`}>
                    {unit.qualification_percentage !== undefined ? `${unit.qualification_percentage}%` : 'N/A'}
                  </div>
                </div>
                <div className="unit-uic">{unit.uic}</div>
                <div className="unit-name">{unit.name}</div>
                <div className="unit-stats">
                  {unit.qualified_tasks !== undefined && unit.total_tasks !== undefined ? (
                    <div className="qualification-stats">
                      Qualified: {unit.qualified_tasks}/{unit.total_tasks} tasks
                    </div>
                  ) : (
                    <div className="unit-meta">
                      ID: {unit.id}
                      {unit.parent_unit_id && ` | Parent: ${unit.parent_unit_id}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {searchResults.length === 0 && searchTerm && (
            <div className="no-results">
              No units found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UICSearch;