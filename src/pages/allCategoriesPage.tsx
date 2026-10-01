import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Clothing =
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1vZGVsJTIwaW4lMjBjbG90aGVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
const Electronics =
  "https://media.istockphoto.com/id/934679404/photo/open-laptop-with-white-digital-tablet-and-smartphone-on-desk-from-above.webp?b=1&s=170667a&w=0&k=20&c=DSddeaw7hmv1RodQXcKcTC6t97w4NlfV5XgrNcrilT8=";
const HomeAndKitchen =
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S0lUQ0hFTiUyMFdBUkVTfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
const Beauty =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXR5fGVufDB8fDB8fHww";

const imagesArray = [Clothing, Electronics, HomeAndKitchen, Beauty];

function AllCategoriesPage() {
  const [categories, setCategories] = useState<
    { category: string; image: string }[]
  >([]);
  useEffect(() => {
    fetch("http://localhost:3000/products/categ_and_subCateg_enums")
      .then((response) => response.json())
      .then((data) => {
        const categoriesStringArr = Object.keys(data);
        const categoriesArray = categoriesStringArr.map((value, index) => ({
          category: value,
          image: imagesArray[index],
        }));
        setCategories(categoriesArray);
      });
  }, []);
  return (
    <Container style={{ marginTop: "100px" }} id='categories'>
      <h2>Categories</h2>
      <Row className='gy-5 pt-3'>
        {categories.slice(0, 4).map((category) => (
          <Col xs={12} md={6} lg={4}>
            <Card className='card-div'>
              <Card.Img src={category?.image} />
              <Card.ImgOverlay className='cards-overlay text-center'>
                <Card.Text
                  style={{
                    fontSize: "30px",
                    fontWeight: "700",
                    color: "white",
                  }}
                  className='overlay-text'
                >
                  {category?.category}
                </Card.Text>
                <Link
                  to={`/products/?category=${encodeURIComponent(category.category)}`}
                >
                  <button style={{ fontSize: "16px", fontWeight: "700" }}>
                    Shop Now
                  </button>
                </Link>
              </Card.ImgOverlay>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AllCategoriesPage;
