import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import { ProductDetail } from "../types";

export default function CategoryProductsPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function getProducts() {
    setError(false);
    setLoading(true);
    fetch(`http://localhost:3000/products${search}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.success)
          throw Error(data?.error || "Something went wrong when fetching");
        setProducts(data.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
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
      {loading ? (
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
      ) : (
        <>
          <h2 className='grid-section-title'>
            {search && decodeURIComponent(search.split("=")[1])}
          </h2>
          <div className='grid-products'>
            {products.length !== 0 ? (
              products.map((product) => (
                <Card className='card-div' key={product.id}>
                  <Card.Img
                    src={product?.imageUrls?.[0]}
                    className='grid-card-img'
                  />
                  <Card.Body className='p-3'>
                    <div className='card-product-name'>
                      <h4>{product.name}</h4>

                      <span>
                        {product?.currency}
                        {product?.price}
                      </span>
                    </div>
                    <div className='card-product-text'>
                      {product.description}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      {/* <button className='button-hover'>Add to Cart</button> */}
                      <button
                        className='button-hover'
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Product
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <h2>No products found</h2>
            )}
          </div>
        </>
      )}
    </>
  );
}
