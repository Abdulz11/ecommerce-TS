import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useAppContext } from "../context/appcontext";
import { ProductDetail } from "../components/products";
import Navbar from "../components/navbar";
import { useLocation } from "react-router-dom";
import { Rings } from "react-loader-spinner";

export default function Clothes() {
  const { addToCart, checkIfAddedToCart, setPath } = useAppContext();
  let { pathname } = useLocation();
  const [clothesProducts, setClothesProducts] = useState<ProductDetail[]>([]);
  const [error, setError] = useState(false);

  function getProducts() {
    fetch(`http://localhost:3000/products?category=Clothing`)
      .then((response) => response.json())
      .then((product) => {
        setClothesProducts(product);
      })
      .catch(() => {
        setError(true);
      });
    setPath(pathname);
  }
  useEffect(() => {
    getProducts();
  }, []);

  // IF ERROR OCCURS DURING FETCHING OF PRODUCTS
  if (error) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 className='error-mess'>Oops, Something went wrong.</h2>
          <button
            onClick={getProducts}
            style={{
              width: "20%",
              fontSize: "20px",
              backgroundColor: "white",
              color: "black",
              border: "2px solid black",
            }}
            className='btn-cart-banner'
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  // IF NO ERROR DURING FETCH
  return (
    <>
      <h2 className='grid-section-title'>Clothes</h2>
      <div className='grid-products'>
        {clothesProducts.length !== 0 ? (
          clothesProducts.map((cloth) => (
            <Card className='card-div' key={cloth.id}>
              <Card.Img src={cloth?.imageUrls?.[0]} className='grid-card-img' />
              <Card.Body className='p-3'>
                <div className='card-product-name'>
                  <h4>{cloth.name}</h4>
                  <span>{cloth?.price}</span>
                </div>
                <div className='card-product-text'>
                  {cloth.description.slice(3).slice(0, -4)}
                </div>
                <button
                  className='button-hover'
                  onClick={() => {
                    addToCart(cloth.id, {
                      id: cloth.id,
                      name: cloth.name,
                      image: cloth.imageUrls?.[0],
                      price: cloth?.price,
                    });
                  }}
                >
                  {checkIfAddedToCart(cloth.id)
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className='loader'>
            <Rings
              height='100'
              width='100'
              color='#808080'
              radius='8'
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
              ariaLabel='rings-loading'
            />
          </div>
        )}
      </div>
    </>
  );
}
