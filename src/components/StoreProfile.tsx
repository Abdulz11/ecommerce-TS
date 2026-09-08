import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import { useAppContext } from "../context/appcontext";
import { cartImage } from "../assets/images/cartImage";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useAuthContext } from "../context/authContext";

type Product = {
  id: string;
  name: string;
  price: number;
  subCategoryId: string;
  description: string;
  imageUrls: string[];
  imageIds: string[];
  tag: string[];
  currency: string;
  quantity: number;
  storeId: string;
  createdAt: Date;
};

type Store = {
  id: string;
  name: string;
  img?: string;
  email?: string;
  whatsapp: string;
  location: string;
  description: string;
};

const LoadingIcon = () => {
  return (
    <div className='loader text-center'>
      <Rings
        height='80'
        width='80'
        color='#808080'
        radius='6'
        visible={true}
        ariaLabel='rings-loading'
      />
    </div>
  );
};

const whatsappMessage = (
  product: Product & { store: { name: string; whatsapp: string } },
) => {
  const message = `Hello, I'm interested in buying ${product.name} of ${product.currency} ${product.price}. Is it still available?`;

  return `https://wa.me/${product.store.whatsapp}?text=${encodeURIComponent(message)}`;
};
export default function StoreProfile() {
  const { userInfo } = useAuthContext();

  // const { addToCart, checkIfAddedToCart, setPath } = useAppContext();
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [storeInfo, setStoreInfo] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [loadingStoreInfo, setLoadingStoreInfo] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(false);
  const [errorStoreInfo, setErrorStoreInfo] = useState(false);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts(false);
      try {
        const response = await fetch(
          `http://localhost:3000/products/store_products/${userInfo?.id}`,
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorProducts(true);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // fetch store info
  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoadingStoreInfo(true);
      setErrorStoreInfo(false);

      try {
        const response = await fetch(
          `http://localhost:3000/store/store_info/${userInfo?.id}`,
        );
        const data = await response.json();
        setStoreInfo(data.data);
      } catch (error) {
        console.error("Error fetching store info:", error);
        setErrorStoreInfo(true);
      } finally {
        setLoadingStoreInfo(false);
      }
    };

    fetchStoreInfo();
  }, []);

  const company = {
    name: storeInfo?.name
      ? storeInfo.name[0].toUpperCase() + storeInfo.name.slice(1)
      : "",
    email: storeInfo?.email,
    description: storeInfo?.description,
    whatsapp: storeInfo?.whatsapp,
    location: storeInfo?.location,
    productCount: products?.length,
    avatar: storeInfo?.img || cartImage,
  };

  return (
    <Container className='profile-page my-4'>
      <Row className='profile-header bg-light p-4 rounded align-items-center shadow-sm'>
        <Col xs={12} md={3} className='text-center'>
          <img
            src={company.avatar}
            alt='avatar'
            className='profile-avatar mb-2'
          />
        </Col>
        <a href={`/store/edit_profile/${storeInfo?.id || "00"}`}>
          Edit Profile
        </a>
        {!loadingStoreInfo ? (
          <Col xs={12} md={6}>
            <h1 className='mb-1'>{company.name}</h1>
            <p className='text-muted mb-2 small'>
              {company?.description || "A store that sells items"}
            </p>
            <p className='mb-0'>
              <a
                // href={whatsappMessage(selectedProduct, storeInfo)}
                // target='_blank'
                rel='noreferrer'
                className='ms-2 d-inline-flex align-items-center'
              >
                <FaWhatsapp size={24} color='green' />
                {storeInfo?.whatsapp || "+23481564655"}
              </a>
            </p>
            <div className='d-flex gap-2 flex-wrap align-items-center'>
              <Badge bg='secondary' className='text-capitalize'>
                {company.location || "Lagos"}
              </Badge>
              <Badge bg='info'>{company?.productCount} Products</Badge>
            </div>
          </Col>
        ) : (
          <LoadingIcon />
        )}

        {/* <Col xs={12} md={3} className='text-md-end mt-3 mt-md-0'>
          <div className='d-flex gap-2 justify-content-center justify-content-md-end'>
            <Button
              variant='primary'
              onClick={() => {
                setShowContact(true);
              }}
            >
              Contact
            </Button>
          </div>
        </Col> */}
      </Row>
      {/* modal */}
      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact {company.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='mb-1'>{company.description}</p>
          <p className='mb-1'>Location: {company.location}</p>
          <p className='mb-1'>Phone: {company.whatsapp}</p>
          <p className='mb-0'>
            WhatsApp:
            <a
              href={`https://wa.me/${storeInfo?.whatsapp}`}
              target='_blank'
              rel='noreferrer'
              className='ms-2 d-inline-flex align-items-center'
            >
              <FaWhatsapp size={24} color='green' />
              {storeInfo?.whatsapp}
            </a>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowContact(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Product Details Modal */}
      <Modal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        centered
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct ? (
            <div className='d-flex flex-column flex-md-row gap-3'>
              <div className='text-center' style={{ flex: "0 0 320px" }}>
                <img
                  src={selectedProduct.imageUrls?.[0]}
                  alt={selectedProduct.name}
                  style={{ width: "100%", height: 260, objectFit: "cover" }}
                  className='rounded'
                />
              </div>
              <div className='flex-grow-1'>
                <h4 className='mb-2'>
                  <Badge bg='success' className='me-2'>
                    {selectedProduct.currency}{" "}
                    {selectedProduct.price?.toFixed(2)}
                  </Badge>
                  <small className='text-muted'>
                    Stock: {selectedProduct.quantity}
                  </small>
                </h4>
                <p className='mb-2'>{selectedProduct.description}</p>
                {selectedProduct.tag?.length > 0 && (
                  <div className='mb-2'>
                    {selectedProduct.tag.map((t, idx) => (
                      <Badge bg='light' text='dark' key={idx} className='me-1'>
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowProductModal(false)}
          >
            Close
          </Button>
          <Button variant='primary'>
            {selectedProduct ? "Saved" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className='mt-4'>
        <Col xs={12}>
          <h2 className='mb-3'>Products</h2>
          <div className='grid-projects'>
            {loadingProducts && <LoadingIcon />}

            {!loadingProducts && products.length > 0 ? (
              <Row xs={1} sm={2} md={3} lg={4} className='g-3'>
                {products.map((p) => (
                  <Col key={p.id}>
                    <Card className='h-100 shadow-sm border-0'>
                      <div style={{ height: 180, overflow: "hidden" }}>
                        <Card.Img
                          variant='top'
                          src={p.imageUrls?.[0]}
                          style={{ height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <Card.Body className='d-flex flex-column'>
                        <div className='d-flex justify-content-between align-items-start'>
                          <Card.Title className='mb-1' style={{ fontSize: 16 }}>
                            {p.name}
                          </Card.Title>
                          <Badge bg='light' text='dark'>
                            {p.currency} {p.price}
                          </Badge>
                        </div>
                        <Card.Text className='text-muted small flex-grow-1 text-truncate'>
                          {p.description}
                        </Card.Text>
                        <div className=' m-auto mt-2'>
                          <Button
                            size='sm'
                            variant='primary'
                            onClick={() =>
                              navigate(`/products/${userInfo?.id}/${p.id}`)
                            }
                          >
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <h3>No items in the store</h3>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
