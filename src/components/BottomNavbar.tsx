import React from 'react';
import styles from '@styles/BottomNavbar.module.css';

interface BottomNavbarProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onLocationClick: () => void;
  onEUClick: () => void;
  onSettingsClick: () => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ onHomeClick, onSearchClick, onLocationClick, onEUClick, onSettingsClick }) => {
  return (
    <nav className={styles.bottomNavbar}>
      <button className={styles.link} onClick={onHomeClick}>
        <img src="/home_icon.png" alt="home"/>
      </button>
      <button className={styles.link} onClick={onSearchClick}>
        <img src="/search_icon.png" alt="search"/>
      </button>

      <button className={styles.link}></button> {/* Empty link to save space for the center icon */}
      <button className={styles.center} onClick={onLocationClick}>
        <img src="/location_icon.png" alt="location"/>
      </button>

      <button className={styles.link} onClick={onEUClick}>
        <img src="/European_stars.png" alt="EU"/>
      </button>
      <button className={styles.link} onClick={onSettingsClick}>
        <img src="/settings_icon.png" alt="settings"/>
      </button>
    </nav>
  );
};

export default BottomNavbar;
