import { useState,useEffect } from "react"
import {Card} from 'react-bootstrap'
import {commerce} from '../lib/commerce'
import { useAppContext } from "../context/appcontext"
import { Product } from "@chec/commerce.js/types/product"
import Navbar from "../components/navbar"
import {  useLocation } from "react-router-dom"


export default function Clothes() {
    const {addToCart,checkIfAddedToCart,cart,setPath,path} = useAppContext()
   console.log(cart)
    
   
  
  let {pathname} = useLocation()
  const [clothesProducts,setClothesProducts] = useState<Product[]>([])
   useEffect(() => {
   
    // commerce.cart.empty().then((response) => console.log(response));
      commerce.products.list({category_slug: ['clothes'],}).then((product) =>setClothesProducts(product.data))
      .catch((err:Error)=>{console.log(err)});
      setPath(pathname)
    }, [])
    console.log(path)
   
  return (
    <> 
      <Navbar/>
      <h2 className='grid-section-title'>Clothes</h2>
      <div className="grid-products">
        {clothesProducts? clothesProducts.map((cloth)=>(
          <Card className='card-div' key={cloth.id}>
            <Card.Img src={cloth?.image?.url} className='grid-card-img'/>
            <Card.Body className='p-3'>
              <div className="card-product-name">
                <h4 >{cloth.name}</h4>
                <span>{cloth.price.formatted_with_symbol}</span>
              </div>
              <div className="card-product-text">
                {cloth.description.slice(3).slice(0,-4)}
              </div> 
              <button onClick={()=>{
                  addToCart(cloth.id,{
                    id:cloth.id,
                    name:cloth.name,
                    image:cloth.image?.url,
                  })
                }}>{checkIfAddedToCart(cloth.id)? "Added to Cart":"Add to Cart"}</button>
             </Card.Body>  
          </Card>)) : <h2>Loading</h2> 
          }
      </div>
    </>
  )
}
