import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/appcontext";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import styles from "./productspage.module.css";
import { useAuthContext } from "../context/authContext";
import { ProductDetail } from "../types";

const dummyProduct: ProductDetail = {
  id: "demo-123",
  name: "Horizon Adventure Speaker",
  description:
    "A premium portable speaker with crisp audio, long battery life, and water-resistant housing for on-the-go listening.",
  imageUrls: [
    "https://images.unsplash.com/photo-1526178617479-1a9f5d6c8928?auto=format&fit=crop&w=1200&q=80",
  ],
  price: {
    raw: 129.99,
    formatted_with_symbol: "$129.99",
  },
  currency: "$",
  quantity: 27,
  subCategory: {
    name: "Portable Speakers",
    category: {
      name: "Audio",
    },
  },
  tag: ["Portable", "Bluetooth", "Water-resistant", "12h Battery"],
};

export default function StoreProductsPage() {
  const { storeId, productId } = useParams();

  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  const [product, setProduct] = useState<ProductDetail | null>(dummyProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageUrls = product?.imageUrls?.length
    ? product.imageUrls
    : ["https://via.placeholder.com/800x600?text=No+Image"];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id, product?.imageUrls?.length]);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/products/store_products/${storeId}/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Unable to load product.");
        }
        const data = await response.json();
        setProduct(data.data || null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product at this time.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const currentImage = imageUrls[activeImageIndex] ?? imageUrls[0];

  const showPrevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const productPrice = product
    ? typeof product.price === "number"
      ? product.price
      : (product.price?.raw ?? 0)
    : 0;

  const formattedPrice = product
    ? typeof product.price === "object" && product.price?.formatted_with_symbol
      ? product.price.formatted_with_symbol
      : `${product.currency ?? "₦"} ${productPrice.toFixed(2)}`
    : "";

  return (
    <Container className={`${styles.pageWrapper} py-5`}>
      <div className='mb-4'>
        <Button
          variant='link'
          className={`${styles.backButton} p-0`}
          onClick={() => navigate(-1)}
        >
          <div>
            <FaArrowLeft /> Back to Store Products
          </div>
        </Button>
      </div>

      {loading ? (
        <div className={styles.loadingPanel}>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className={styles.errorPanel}>
          <Alert variant='danger'>{error}</Alert>
        </div>
      ) : product ? (
        <div className={styles.productCard}>
          <div className={styles.productHero}>
            <div className={styles.imagePanel}>
              <button
                type='button'
                className={`${styles.sliderButton} ${styles.sliderButtonPrev}`}
                onClick={showPrevImage}
                aria-label='Previous image'
              >
                <FaChevronLeft />
              </button>

              <div className={styles.sliderViewport}>
                <div
                  className={styles.sliderTrack}
                  style={{
                    transform: `translateX(-${activeImageIndex * 100}%)`,
                  }}
                >
                  {imageUrls.map((url, idx) => (
                    <div className={styles.slide} key={idx}>
                      <img
                        className={styles.mainImage}
                        src={url}
                        alt={`${product.name} ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.imageCounter}>
                {activeImageIndex + 1}/{imageUrls.length}
              </div>

              <button
                type='button'
                className={`${styles.sliderButton} ${styles.sliderButtonNext}`}
                onClick={showNextImage}
                aria-label='Next image'
              >
                <FaChevronRight />
              </button>
            </div>

            <div className={styles.productDetails}>
              <div className={styles.productHeader}>
                <div>
                  <h1 className={styles.productTitle}>{product.name}</h1>
                  <div className={styles.metaBadges}>
                    <Badge bg='primary' className={styles.metaBadge}>
                      {product.subCategory?.name}
                    </Badge>
                    <Badge bg='secondary' className={styles.metaBadge}>
                      {product.quantity ?? 0} in stock
                    </Badge>
                  </div>
                </div>
                <div className={styles.priceTag}>
                  {formattedPrice} this price{" "}
                </div>
              </div>

              <p className={styles.productDescription}>{product.description}</p>

              <div className={styles.productInfoGrid}>
                <div className={styles.productStat}>
                  <span className={styles.productStatTitle}>Category</span>
                  <span className={styles.productStatValue}>
                    {product.subCategory?.category?.name ?? "General"}
                  </span>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <Button
                  variant='primary'
                  onClick={() =>
                    navigate(`/products/edit_product/${product.id}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant='outline-secondary'
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  View details
                </Button>
              </div>

              {product.tag?.length ? (
                <div>
                  <h6 className='mt-4 mb-3'>Highlights</h6>
                  <ul className={styles.featureList}>
                    {product.tag.map((tag, index) => (
                      <li key={index} className={styles.featureItem}>
                        <span className={styles.featureBullet}></span>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className={styles.productFooter}>
                <span className={styles.productFooterSubtitle}>
                  Fast delivery available
                </span>
                <span className={styles.productFooterSubtitle}>
                  Secure checkout & friendly support
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.errorPanel}>
          <Alert variant='warning'>No product information is available.</Alert>
        </div>
      )}
    </Container>
  );
}
