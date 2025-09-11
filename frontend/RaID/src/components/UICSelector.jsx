import { useState } from 'react';
import './UICSelector.css';

function UICSelector({ selectedUIC, onUICChange }) {
  // Keep track of whether the dropdown is open or closed
  var isOpen = useState(false)[0];
  var setIsOpen = useState(false)[1];

  // List of all the UIC options
  var uicOptions = [
    { code: 'WAZMB0', name: 'Alpha Company' },
    { code: 'WAZMB1', name: 'Bravo Company' },
    { code: 'WAZMB2', name: 'Charlie Company' },
    { code: 'WAZMB3', name: 'Delta Company' },
    { code: 'WAZMB4', name: 'Echo Company' }
  ];

  // Function to open or close the dropdown
  function handleToggle() {
    setIsOpen(!isOpen);
  }

  // Function to handle when user selects a UIC
  function handleSelect(uic) {
    setIsOpen(false);
    onUICChange(uic);
  }

  // Find the currently selected UIC, or use the first one as default
  var currentUIC = null;
  for (var i = 0; i < uicOptions.length; i++) {
    if (uicOptions[i].code === selectedUIC) {
      currentUIC = uicOptions[i];
      break;
    }
  }
  if (!currentUIC) {
    currentUIC = uicOptions[0];
  }

  // Figure out the CSS class for the dropdown arrow
  var arrowClass = 'uic-dropdown-arrow';
  if (isOpen) {
    arrowClass = arrowClass + ' open';
  }

  return (
    <div className="uic-selector">
      <button 
        className="uic-selector-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label="Select UIC"
      >
        <span className="uic-code">{currentUIC.code}</span>
        <svg 
          className={arrowClass}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="uic-dropdown">
          {uicOptions.map(function(uic) {
            // Figure out the CSS class for this option
            var optionClass = 'uic-option';
            if (uic.code === selectedUIC) {
              optionClass = optionClass + ' selected';
            }
            
            return (
              <button
                key={uic.code}
                className={optionClass}
                onClick={function() {
                  handleSelect(uic);
                }}
              >
                <span className="uic-option-code">{uic.code}</span>
                <span className="uic-option-name">{uic.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UICSelector;