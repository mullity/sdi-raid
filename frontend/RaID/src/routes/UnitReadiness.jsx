import { useState } from 'react';
import UICSearch from '../components/UICSearch';
import UnitDashboard from '../components/UnitDashboard';
import './UnitReadiness.css';

function UnitReadiness() {
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
  };

  const handleBackToSearch = () => {
    setSelectedUnit(null);
  };

  return (
    <div className="unit-readiness-page">
      {selectedUnit ? (
        <UnitDashboard 
          unit={selectedUnit} 
          onBack={handleBackToSearch} 
        />
      ) : (
        <UICSearch onUnitSelect={handleUnitSelect} />
      )}
    </div>
  );
}

export default UnitReadiness;