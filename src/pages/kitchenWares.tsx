import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { commerce } from "../lib/commerce";
import { Product } from "@chec/commerce.js/types/product";
import Navbar from "../components/navbar";
import { useAppContext } from "../context/appcontext";
import { useLocation } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { ProductDetail } from "../components/products";

function KitchenWares() {
  const { addToCart, checkIfAddedToCart, setPath } = useAppContext();

  let { pathname } = useLocation();

  const [kitchenWares, setKitchenWares] = useState<ProductDetail[]>();
  const [error, setError] = useState(false);

  function getProducts() {
    fetch(
      `http://localhost:3000/products?category=${encodeURIComponent("Home & Kitchen")}`,
    )
      .then((response) => response.json())
      .then((product) => {
        setKitchenWares(product);
      })
      .catch(() => {
        setError(true);
      });
    setPath(pathname);
  }
  useEffect(() => {
    getProducts();
  }, []);
  // IF ERROR OCUURS DURING FETCHING PRODUCTS
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
      <h2 className='grid-section-title'>Home & Kitchen</h2>
      <div className='grid-products'>
        {kitchenWares ? (
          kitchenWares.map((item) => (
            <Card className='card-div' key={item.id}>
              <Card.Img src={item?.imageUrls?.[0]} className='grid-card-img' />
              <Card.Body className='p-3'>
                <div className='card-product-name'>
                  <h4>{item.name}</h4>
                  <span>{item.price}</span>
                </div>
                <div className='card-product-text'>
                  {item.description.slice(3).slice(0, -4)}
                </div>
                <button className='button-hover'>Add to Cart</button>
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

export default KitchenWares;
