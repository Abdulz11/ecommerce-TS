import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { useAppContext } from "../context/appcontext"
import { commerce } from "../lib/commerce"
import { Bars } from "react-loader-spinner"



export default function Cart() {
  const navigate = useNavigate()
  const {cart,removeItem,path,clearCart,setToken,buttonLoader,setButtonLoader} = useAppContext()

  function generateToken(){
    let cartID = commerce.cart.id();
    if(cartID){
    setButtonLoader(true)
     commerce.checkout.generateTokenFrom('cart',cartID).then((res)=> {
    setToken(res)
    setButtonLoader(false)
    navigate('checkout')
  })
  .catch(()=>setButtonLoader(false))
}
}
 

  return (
    <>
    <Navbar/>
     <Link to={`${path}`} className="back-link" style={{margin:'35px',fontSize:"18px"}}><i className='bi-chevron-left'></i>{'  '}Go Back
     </Link> 
    <div className="cart-container">
      <div style={{display:'flex',justifyContent:'space-between',width:'90vw',alignItems:'center',}}>
      <h2> Cart</h2>
      { cart.length > 0 &&
      <div className='cart-banner'>
        <span style={{fontSize:"22px"}}>Total price: ${cart.reduce((prev,curr)=>prev + curr.price, 0)}</span>
        <div style={{display:'flex'}}>
          <button className="btn-cart-banner" onClick={clearCart}>Clear Cart</button>
          <button  className="btn-cart-banner" style={{textDecoration:'none',color:'white'}} onClick={generateToken}>{buttonLoader ?  <Bars
            height="25"
            width="72"
            color="grey"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
/> : "Checkout"}</button>
        </div>
      </div>}
      </div>
      
      <div className={cart.length? "grid-cart": "no-item-div"}>
        {(cart.length) ? cart.map((item)=>{
          return(
            <div key={item.id}>
              <div className="cart-card" >
                <div className="card-cart-img-div">
                  <img src={`${item.image}`} alt="item" />
                </div>
                <div className="cart-card-body">
                  <div style={{display:'flex',margin:'0.7rem 0',justifyContent:'space-around',width:'100%'}}> 
                  <h5>{item.name}</h5>
                  <h5>${item.price}</h5>
                  </div>
                 
                  <button style={{fontWeight:'600'}} className="btn" onClick={()=>{removeItem(item.id)}}>Remove</button>
                </div>
              </div>
            </div>
          )

        }): <h2 className="no-item-text">No Items Have Been Added</h2>}
      </div>
    </div>
    </>
  )
}


