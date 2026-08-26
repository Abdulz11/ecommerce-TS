import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Navbar from "../components/navbar";
import { useAppContext } from "../context/appcontext";
import { useLocation } from "react-router-dom";
import { Rings } from "react-loader-spinner";

type Product = {
  name: string;
  id: string;
  description: string;
  imageUrls: string[];
  imageIds: string[];
  tag: string[];
  price: number;
  currency: string;
  quantity: number;
  createdAt: string;
  storeId: string;
  subCategoryId: string;
};

function Devices() {
  // const { addToCart, checkIfAddedToCart, setPath } = useAppContext();
  let { pathname } = useLocation();

  const [error, setError] = useState(false);
  const [deviceProducts, setDeviceProducts] = useState<Product[] | null>(null);

  function getProducts() {
    fetch(`http://localhost:3000/products?category=Electronics`)
      .then((response) => response.json())
      .then((product) => {
        setDeviceProducts(product);
      })
      .catch(() => {
        setError(true);
      });
  }
  useEffect(() => {
    getProducts();
  }, []);

  // IF AN ERROR OCCURS IN FETCHING PRODUCTS
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

  // IF NO ERROR IN FETCH
  return (
    <>
      <h2 className='grid-section-title'>Devices</h2>
      <div className='grid-products'>
        {deviceProducts ? (
          deviceProducts.map((item) => (
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

export default Devices;
