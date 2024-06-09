import React from 'react'
import styles from '@styles/EuCard.module.css'

interface ProductCardProps {
  name: string;
  country: string;
  on_click?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (
    <div className={styles.card} onClick={props.on_click}>
      <h2>{props.name}</h2>
      <div className={styles.verticalHr}/>
      <h3>{props.country}</h3>
    </div>
  )
}

export default ProductCard