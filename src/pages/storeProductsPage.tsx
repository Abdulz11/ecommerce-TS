import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
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
import { fetchData } from "../lib/api";

export default function StoreProductsPage() {
  const { storeId, productId } = useParams();

  const [deleteProduct, setDeleteProduct] = useState({} as ProductDetail);
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (product: ProductDetail) => {
    try {
      await fetchData(
        `/store/${storeId}/products/${productId?.toUpperCase()} `,
        "DELETE",
      );
      console.log(`${product.name} has been deleted`);
      setDeleteModal(false);
    } catch (e) {
      console.log();
      setError(`${product.id} could not be deleted`);
    }
  };

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
        const response = await fetchData(
          `/store/${storeId}/products/${productId}`,
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

  const productPrice = product?.price ?? 0;

  const formattedPrice =
    product?.price !== undefined &&
    `${product?.currency ?? "₦"} ${product?.price}`;

  return (
    <>
      {/*DELETE MODAL*/}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>

        <Modal.Body className='fs-5 fw-semibold text-center'>
          {`Are you sure you want to delete ${deleteProduct?.name}`}?
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>

          <Button
            variant='danger'
            onClick={() => handleDelete(product as ProductDetail)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className={`${styles.pageWrapper} py-5`}>
        <div className='mb-4'>
          <Button
            variant='link'
            className={`${styles.backButton} p-0`}
            style={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
            }}
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

                <p className={styles.productDescription}>
                  {product.description}
                </p>

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
                    variant='danger'
                    onClick={() => {
                      setDeleteModal(true);
                      console.log(`${product} wants to be deleted`);
                      setDeleteProduct(product);
                    }}
                  >
                    Delete
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
            <Alert variant='warning'>
              No product information is available.
            </Alert>
          </div>
        )}
      </Container>
    </>
  );
}
