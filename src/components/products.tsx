import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./products.module.css";
import { fetchData } from "../lib/api";
import { ProductDetail } from "../types";

function Products() {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchData("/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const getInStockStatus = (quantity?: number) => {
    if (!quantity) return { text: "In Stock", className: "" };
    if (quantity > 10) return { text: "In Stock", className: "" };
    if (quantity > 0)
      return { text: `${quantity} Left`, className: "lowStock" };
    return { text: "Out of Stock", className: "lowStock" };
  };

  return (
    <Container className={styles.productsSection} id='products'>
      <h2 className={styles.sectionTitle}>Featured Products</h2>

      {loading ? (
        <div className={styles.loadingGrid}>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading products...</span>
          </Spinner>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📦</div>
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.slice(0, 6).map((product) => {
            const stockStatus = getInStockStatus(product?.quantity);
            const price = product?.price ?? 0;
            const categoryName = product?.subCategory?.name || "Featured";

            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <img
                    src={
                      product.imageUrls?.[0] ||
                      "https://via.placeholder.com/260x220?text=No+Image"
                    }
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productOverlay}>
                    {/* <button
                      className={styles.overlayButton}
                      onClick={() => handleViewProduct(product?.id)}
                      title='View details'
                    >
                      👁️
                    </button>
                    <button
                      className={styles.overlayButton}
                      onClick={() => console.log(product)}
                      title='Add to cart'
                    >
                      🛒
                    </button> */}
                  </div>
                </div>

                <div className={styles.productContent}>
                  <h3 className={styles.productName}>{product?.name}</h3>

                  <span className={styles.storeInfo}>
                    {product.tag?.length ? `${product.tag[0]}` : "Premium"}
                  </span>

                  <div className={styles.priceRow}>
                    <span className={styles.productPrice}>
                      <span className={styles.productCurrency}>
                        {product.currency}{" "}
                      </span>
                      {product?.price?.toFixed(2)}
                    </span>
                    <span
                      className={`${styles.quantityBadge} ${styles[stockStatus.className]}`}
                    >
                      {stockStatus.text}
                    </span>
                  </div>

                  <div className={styles.productMeta}>
                    <span className={styles.categoryTag}>{categoryName}</span>
                    {product.quantity && (
                      <span className={styles.metaItem}>
                        📦 {product.quantity}
                      </span>
                    )}
                  </div>

                  <div className={styles.actionsContainer}>
                    <button
                      className={`${styles.productButton} ${styles.secondaryButton}`}
                      onClick={() => handleViewProduct(product.id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

export default Products;
