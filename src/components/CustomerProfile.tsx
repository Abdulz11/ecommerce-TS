import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { cartImage } from "../assets/images/cartImage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import styles from "../components/customerProfile.module.css";

type ViewedItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

export default function CustomerProfile() {
  const navigate = useNavigate();

  const viewedItemsDemo: ViewedItem[] = Array.from({ length: 6 }).map(
    (_, i) => ({
      id: `v-${i + 1}`,
      title: `Viewed Item ${i + 1}`,
      description: `Recently viewed item ${i + 1}.`,
      image: cartImage,
      price: 12000 + i * 1500,
    }),
  );

  const [viewedItems] = useState<ViewedItem[]>(viewedItemsDemo);

  return (
    <Container className='profile-page my-4'>
      <Row className='profile-header bg-light p-4 rounded align-items-center shadow-sm'>
        <Col xs={12} md={12} className={`text-center ${styles.header}`}>
          <img
            src={cartImage}
            alt='avatar'
            className='profile-avatar mb-2'
            style={{ position: "relative" }}
          />
          <Badge bg='black' className={styles.editBadge}>
            <a href='/'>
              <FaPencil /> Edit Profile
            </a>
          </Badge>
        </Col>

        <Col xs={12} md={12} className='text-center'>
          <h1 className='mb-1'>Jane Doe</h1>

          <div className='d-flex gap-2 flex-wrap align-items-center justify-content-center mt-4'>
            <Badge bg='dark'>0 In Cart</Badge>
          </div>

          <div className='d-flex gap-2 justify-content-center mt-4 flex-wrap'>
            <Button
              variant='primary-outline'
              onClick={() => console.log("cart")}
            >
              View Cart
            </Button>
          </div>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col xs={12}>
          <h2 className='mb-3'>Viewed Items</h2>
          <div className='grid-projects'>
            {viewedItems.length === 0 ? (
              <h3>No viewed items yet.</h3>
            ) : (
              <Row xs={1} sm={2} md={3} lg={4} className='g-3'>
                {viewedItems.map((item) => (
                  <Col key={item.id}>
                    <Card className='h-100 shadow-sm border-0'>
                      <div style={{ height: 180, overflow: "hidden" }}>
                        <Card.Img
                          variant='top'
                          src={
                            item?.image ||
                            "https://via.placeholder.com/800x600?text=No+Image"
                          }
                          style={{ height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <Card.Body className='d-flex flex-column'>
                        <div className='d-flex justify-content-between align-items-start'>
                          <Card.Title className='mb-1' style={{ fontSize: 16 }}>
                            {item.title}
                          </Card.Title>
                          <Badge bg='light' text='dark'>
                            ₦{item.price}
                          </Badge>
                        </div>
                        <Card.Text className='text-muted small flex-grow-1'>
                          {item.description}
                        </Card.Text>
                        <div className='mt-2'>
                          <Button
                            size='sm'
                            variant='primary'
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
