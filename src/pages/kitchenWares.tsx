import { useState,useEffect } from "react"
import {Card} from 'react-bootstrap'
import {commerce} from'../lib/commerce'
import { Product } from "@chec/commerce.js/types/product"
import Navbar from "../components/navbar"
import { useAppContext } from "../context/appcontext"
import { useLocation } from "react-router-dom"



function KitchenWares() {
  const{addToCart,checkIfAddedToCart,setPath} = useAppContext()

  let {pathname} = useLocation()
  
  
  const [kitchenWares,setKitchenWares] = useState<Product[]>()
  useEffect(() => {
    commerce.products.list({category_slug: ['kitchen-wares'],}).then((product) =>setKitchenWares(product.data));
    setPath(pathname)
  }, [])
  return (
    <> 
    <Navbar/>
    <h2 className='grid-section-title'>Kitchen-wares</h2>
    <div className="grid-products">
      {kitchenWares? kitchenWares.map((item)=>(
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
            <button onClick={()=>{
                addToCart(item.id,{
                  id:item.id,
                  name:item.name,
                  image:item.image?.url,
                })
              }}>{checkIfAddedToCart(item.id)? "Added to Cart":"Add to Cart"}</button>
           </Card.Body>  
        </Card>)) : <h2>Loading</h2> 
        }
    </div>
  </>
 )
}

export default KitchenWares