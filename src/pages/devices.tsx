import { useState,useEffect } from "react"
import {Card} from 'react-bootstrap'
import {commerce} from'../lib/commerce'
import { Product } from "@chec/commerce.js/types/product"
import Navbar from "../components/navbar"
import { useAppContext } from "../context/appcontext"
import { useLocation } from "react-router-dom"
import  { Rings } from 'react-loader-spinner'




function Devices() {
  const{addToCart,checkIfAddedToCart,setPath} = useAppContext()
  let {pathname} = useLocation()
  const [error,setError] = useState(false)
  const [deviceProducts,setDeviceProducts] = useState<Product[] | null>(null)

  function getProducts(){
    commerce.products.list({category_slug: ['devices'],}).then((product) =>{
      setDeviceProducts(product.data)
      setPath(pathname)}
   )
    .catch(()=>{
      setError(true)
    })
  }
  useEffect(() => {
    getProducts()
  }, [])

  // IF AN ERROR OCCURS IN FETCHING PRODUCTS
  if(error){
    return(
      <>
      <Navbar/>
      <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
    <h2 style={{fontSize:'40px',margin:'100px 0px'}}>Oops, Something went wrong.</h2>
    <button
   onClick={getProducts}
       style={{
           width:'20%',
           fontSize:"20px",
           backgroundColor:'white',
           color:'black',
           border:'2px solid black',
           }} 
           className='btn-cart-banner' 
          >Retry
       </button>  
    </div> 
    </>
    )
  }

  // IF NO ERROR IN FETCH
  return (
    <> 
    <Navbar/>
    <h2 className='grid-section-title'>Devices</h2>
    <div className="grid-products">
      {deviceProducts? deviceProducts.map((item)=>(
        <Card className='card-div' key={item.id}>
          <Card.Img src={item?.image?.url} className='grid-card-img'/>
          <Card.Body className='p-3'>
            <div className="card-product-name">
              <h4>{item.name}</h4>
              <span>{item.price.formatted_with_symbol}</span>
            </div>
            <div className="card-product-text">
              {item.description.slice(3).slice(0,-4)}
            </div> 
            <button className='button-hover' onClick={()=>{
                addToCart(item.id,{
                  id:item.id,
                  name:item.name,
                  image:item.image?.url,
                  price:item.price.raw
                })
              }}>{checkIfAddedToCart(item.id)? "Added to Cart":"Add to Cart"}</button>
           </Card.Body>  
        </Card>)) :<div style={{width:'100vw',display:'flex',justifyContent:'center'}}><Rings
  height="100"
  width="100"
  color="#808080"
  radius="8"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel="rings-loading"
/></div>
        }
    </div>
  </>
 )
}

export default Devices