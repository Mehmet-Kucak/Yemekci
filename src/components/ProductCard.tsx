import React from 'react'
import styles from '@styles/ProductCard.module.css'

interface ProductCardProps {
    name: string;
    img: string;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
    
    return (
        <div className={styles.card}>
                <img src={props.img} alt={props.name} />
                <p>{props.name}</p>
        </div>
    )
}

export default ProductCard