import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  // Get the theme info from the context
  var themeInfo = useTheme();
  var isDark = themeInfo.isDark;
  var toggleTheme = themeInfo.toggleTheme;

  // Figure out what text to show for accessibility
  var accessibilityText;
  if (isDark) {
    accessibilityText = 'Switch to light mode';
  } else {
    accessibilityText = 'Switch to dark mode';
  }

  // Figure out what CSS class to use
  var sliderClass;
  if (isDark) {
    sliderClass = 'toggle-slider dark';
  } else {
    sliderClass = 'toggle-slider light';
  }

  // Figure out what icon to show
  var icon;
  if (isDark) {
    icon = '🌙';
  } else {
    icon = '☀️';
  }

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={accessibilityText}
      title={accessibilityText}
    >
      <div className="toggle-container">
        <div className={sliderClass}>
          <span className="toggle-icon">
            {icon}
          </span>
        </div>
      </div>
    </button>
  );
}

export default ThemeToggle;