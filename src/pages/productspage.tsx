import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaChevronRight, FaWhatsapp } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { Alert, Badge, Button, Container, Spinner } from "react-bootstrap";
import styles from "./productspage.module.css";
import { ProductDetail, ProfileData } from "../types";
import { fetchData } from "../lib/api";

const whatsappMessage = (
  product: ProductDetail & { store: { whatsapp: string } },
) => {
  if (
    product?.store?.whatsapp === undefined ||
    product?.store?.whatsapp === null ||
    product?.store?.whatsapp === ""
  ) {
    return "#";
  }
  const message = `Hello, I'm interested in buying ${product.name} of ${product.currency} ${product.price}. Is it still available?`;

  return `https://wa.me/${product.store.whatsapp}?text=${encodeURIComponent(message)}`;
};

export default function ProductsPage() {
  const { productId } = useParams();

  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
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
        const response = await fetchData(`/products/${productId}`);
        if (!response.ok) {
          throw new Error("Unable to load product.");
        }
        const data = await response.json();
        setProduct(data.data);
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
  }, []);

  const currentImage = imageUrls[activeImageIndex] ?? imageUrls[0];

  const isFirstImage = activeImageIndex === 0;
  const isLastImage = activeImageIndex === imageUrls.length - 1;

  const showPrevImage = () => {
    if (isFirstImage) return;
    setActiveImageIndex((prevIndex) => prevIndex - 1);
  };

  const showNextImage = () => {
    if (isLastImage) return;
    setActiveImageIndex((prevIndex) => prevIndex + 1);
  };

  const productPrice = product?.price;

  const formattedPrice =
    product?.price !== undefined
      ? `${product.currency ?? "₦"} ${product?.price?.toFixed(2)}`
      : "";

  return (
    <Container className={`${styles.pageWrapper} py-5`}>
      <div className='mb-4'>
        <Button
          variant='link'
          className={`${styles.backButton} p-0`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back to catalog
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
                className={`${styles.sliderButton} ${styles.sliderButtonPrev} ${
                  isFirstImage ? styles.sliderButtonDisabled : ""
                }`}
                onClick={showPrevImage}
                disabled={isFirstImage}
                aria-label='Previous image'
                aria-disabled={isFirstImage}
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
                className={`${styles.sliderButton} ${styles.sliderButtonNext} ${
                  isLastImage ? styles.sliderButtonDisabled : ""
                }`}
                onClick={showNextImage}
                disabled={isLastImage}
                aria-label='Next image'
                aria-disabled={isLastImage}
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
                      {product?.subCategory?.name ?? "Featured"}
                    </Badge>
                    <Badge bg='secondary' className={styles.metaBadge}>
                      {product?.quantity ?? 0} in stock
                    </Badge>
                  </div>
                </div>
                {product?.subCategory?.name}
                <div className={styles.priceTag}>
                  {formattedPrice} this price{" "}
                </div>
              </div>

              <p className={styles.productDescription}>
                {product?.description}
              </p>

              <div className={styles.productInfoGrid}>
                <div className={styles.productStat}>
                  <span className={styles.productStatTitle}>Category</span>
                  <span className={styles.productStatValue}>
                    {product?.subCategory?.category?.name ?? "General"}
                  </span>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <Button
                  variant='primary'
                  onClick={() => console.log("added to cart")}
                >
                  Add to cart
                </Button>

                {(
                  product as ProductDetail & {
                    store: {
                      whatsapp: string;
                    };
                  }
                ).store.whatsapp ? (
                  <>
                    <Button
                      variant='outline-secondary'
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      <a
                        href={whatsappMessage(
                          product as ProductDetail & {
                            store: {
                              whatsapp: string;
                            };
                          },
                        )}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <FaWhatsapp color='black' size={30} />
                      </a>
                    </Button>
                    <small
                      style={{
                        color: "gray",
                        margin: "auto",

                        fontSize: "12px",
                      }}
                    >
                      Contact seller about product
                    </small>
                  </>
                ) : (
                  <p>Seller does not have whatsapp contact</p>
                )}
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
