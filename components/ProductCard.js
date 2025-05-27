import Link from 'next/link';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    imageUrl,
    category,
    brand,
    rating,
    stock,
    onSale
  } = product;

  return (
    <Link href={`/products/${id}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={imageUrl} alt={name} />
        {onSale && <span className={styles.saleTag}>Sale</span>}
        {stock === 0 && <span className={styles.outOfStockTag}>Out of Stock</span>}
      </div>
      
      <h3 className={styles.productName}>{name}</h3>
      
      <div className={styles.productPriceContainer}>
        <p className={onSale ? styles.salePrice : styles.productPrice}>
          ${price.toFixed(2)}
        </p>
        
        {onSale && originalPrice && (
          <p className={styles.originalPrice}>${originalPrice.toFixed(2)}</p>
        )}
      </div>
      
      <p className={styles.productCategory}>{category}</p>
      <p className={styles.productBrand}>{brand}</p>
      <p className={styles.productRating}>Rating: {rating}/5</p>
      
      {stock > 0 && stock < 5 && (
        <p className={styles.lowStockWarning}>Only {stock} left!</p>
      )}
    </Link>
  );
};

export default ProductCard;
