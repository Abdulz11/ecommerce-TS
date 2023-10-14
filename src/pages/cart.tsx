import { Link } from "react-router-dom"
import Navbar from "../components/navbar"
import { useAppContext } from "../context/appcontext"


export default function Cart() {
  const {cart,removeItem,path,setCart} = useAppContext()
  console.log(cart)

  function clearCart(){
    setCart([])
    // make request to clear cart
}
 
 
  

  return (
    <>
    <Navbar/>
     <Link to={`${path}`} className="back-link" style={{margin:'35px',fontSize:"18px"}}>Go Back</Link> 
    <div className="cart-container">
      <div style={{display:'flex',justifyContent:'space-between',width:'90vw',alignItems:'center',}}>
      <h2> Cart</h2>
      { cart.length > 0 &&
      <div className='cart-banner'>
        <span>Total price:$100</span>
        <div>
          <button className="btn-cart-banner" onClick={clearCart}>Clear Cart</button>
          <button className="btn-cart-banner"><Link style={{textDecoration:'none',color:'inherit'}} to='/checkout '>Checkout</Link></button>
        </div>
      </div>}
      </div>
      
      <div className={cart.length? "grid-cart": "no-item-div"}>
        {(cart.length) ? cart.map((item)=>{
          return(
            <>
              <div className="cart-card" key={item.id}>
                <div className="card-cart-img-div">
                  <img src={`${item.image}`} alt="item" />
                </div>
                <div className="cart-card-body">
                  <h5 style={{margin:'10px 0'}}>{item.name}</h5>
                  <button className="btn" onClick={()=>{removeItem(item.id)}}>Remove</button>
                </div>
              </div>
            </>
          )

        }): <h2 className="no-item-text">No Items Have Been Added</h2>}
      </div>
    </div>
    </>
  )
}


