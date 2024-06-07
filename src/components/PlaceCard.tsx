import React from 'react'
import styles from '@styles/PlaceCard.module.css'
import { start } from 'repl';

interface PlaceCardProps {
    name: string;
    img: string;
    stars: number;
    reviews: number;
    distance: number;
    on_click?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = (props) => {
    
    return (
        <div className={styles.card} onClick={props.on_click}>
            <div className={styles.info}>
                <h4>{props.name}</h4>
                <div className={styles.star} >
                    <img src="/star_icon.svg" alt="" />
                    <span>{props.stars}({props.reviews})</span>
                </div>
            </div>
            <img src={props.img} alt={props.name} className={styles.img}></img>
            <div className={styles.distance}>
                <img src="/direction_icon.svg" alt="direction-icon" />
                <p>{props.distance}km</p>
            </div>
        </div>
    )
}

export default PlaceCard