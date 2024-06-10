import React from "react";
import styles from "@styles/ProductCard.module.css";

interface ProductCardProps {
  name: string;
  img: string;
  on_click?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (
    <div className={styles.card} onClick={props.on_click}>
      <img src={props.img} alt={props.name} />
      <p>{props.name}</p>
    </div>
  );
};

export default ProductCard;
