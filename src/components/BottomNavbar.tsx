import React from 'react';
import styles from '@styles/BottomNavbar.module.css';

interface BottomNavbarProps {
  active: number;
  onHomeClick: () => void;
  onSearchClick: () => void;
  onLocationClick: () => void;
  onEUClick: () => void;
  onFavsClick: () => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({active, onHomeClick, onSearchClick, onLocationClick, onEUClick, onFavsClick }) => {
  return (
    <nav className={styles.bottomNavbar}>
      <button className={`${styles.link} ${active === 0 ? styles.active : ''}`} onClick={onHomeClick}>
        <img src="/home_icon.png" alt="home"/>
      </button>
      <button className={`${styles.link} ${active === 1 ? styles.active : ''}`} onClick={onSearchClick}>
        <img src="/search_icon.png" alt="search"/>
      </button>

      <button className={styles.link}></button> {/* Empty link to save space for the center icon */}
      <button className={`${styles.center} ${active === 2 ? styles.active : ''}`} onClick={onLocationClick}>
        <img src="/location_icon.png" alt="location"/>
      </button>

      <button className={`${styles.link} ${active === 3 ? styles.active : ''}`} onClick={onFavsClick}>
        <img src="/fullstar_white_icon.svg" alt="favs"/>
      </button>
      <button className={`${styles.link} ${active === 4 ? styles.active : ''}`} onClick={onEUClick}>
        <img src="/European_stars.png" alt="EU"/>
      </button>
    </nav>
  );
};

export default BottomNavbar;
