import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useAppContext } from "../context/appcontext";
import { cartImage } from "../assets/images/cartImage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CustomerProfile() {
  const { addToCart, checkIfAddedToCart, cart } = useAppContext();
  const navigate = useNavigate();

  const recommendedItemsDemo = Array.from({ length: 6 }).map((_, i) => ({
    id: `r-${i + 1}`,
    title: `Recommended ${i + 1}`,
    description: `Recommended product ${i + 1} for you.`,
    image: cartImage,
    price: 0,
  }));

  const [recommendedItems, setRecommendedItems] =
    useState(recommendedItemsDemo);

  return (
    <Container className='profile-page my-4'>
      <Row className='profile-header bg-light p-4 rounded align-items-center'>
        <Col xs={12} md={3} className='text-center'>
          <img src={cartImage} alt='avatar' className='profile-avatar mb-2' />
        </Col>
        <Col xs={12} md={6}>
          <h1 className='mb-1'>Jane Doe</h1>
          <div className='text-muted mb-2'>
            Enthusiastic shopper & bargain hunter
          </div>
          <div className='d-flex gap-3 flex-wrap'>
            <Badge bg='secondary'>Lagos, NG</Badge>
            <Badge bg='info'>Member</Badge>
            <Badge bg='light' text='dark'>
              {cart?.length || 0} In Cart
            </Badge>
          </div>
        </Col>
        <Col xs={12} md={3} className='text-md-end mt-3 mt-md-0'>
          <div className='d-flex gap-2 justify-content-center justify-content-md-end'>
            <Button
              variant='outline-primary'
              onClick={() => navigate("/orders")}
            >
              Orders
            </Button>
            <Button variant='primary' onClick={() => navigate("/profile/edit")}>
              Edit Profile
            </Button>
          </div>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col md={6} xs={12} className='mb-4'>
          <h2 className='mb-3'>Recommended For You</h2>
          <div className='grid-projects'>
            <Row xs={1} sm={2} md={2} className='g-3'>
              {recommendedItems.length > 0 ? (
                <div className='text-center text-muted'>
                  No recommendations available at the moment.
                </div>
              ) : (
                recommendedItems.map((p) => (
                  <Col key={p.id}>
                    <Card className='h-100'>
                      <Card.Img variant='top' src={p.image} />
                      <Card.Body className='d-flex flex-column'>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Text className='text-muted flex-grow-1'>
                          {p.description}
                        </Card.Text>
                        <div className='d-flex gap-2 mt-2 justify-content-end'>
                          <Button
                            size='sm'
                            variant={
                              checkIfAddedToCart(p.id)
                                ? "success"
                                : "outline-primary"
                            }
                            onClick={() =>
                              addToCart(p.id, {
                                id: p.id,
                                name: p.title,
                                price: p.price,
                              })
                            }
                          >
                            {checkIfAddedToCart(p.id)
                              ? "In Cart"
                              : "Add to Cart"}
                          </Button>
                          <Button
                            size='sm'
                            variant='secondary'
                            onClick={() => navigate(`/products/${p.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
