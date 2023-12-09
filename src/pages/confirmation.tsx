import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { useAppContext } from "../context/appcontext"
import { useEffect } from "react"
import { commerce } from "../lib/commerce"


export default function Confirmation() {
  const {checkoutData,checkoutOrder} = useAppContext()
  let navigate = useNavigate()
 
  if(checkoutOrder === null || checkoutOrder === undefined){
     navigate("/")
  }
  useEffect(()=>{
    commerce.cart.refresh().then();
    localStorage.removeItem('cart')
  },[])
  return (
    <div>
      <Navbar/>
        <Container  style={{marginTop:'100px',textAlign:'center',boxShadow:'0px 2px 5px black'}}>
            <h2 className="mb-4 mt-2 p-4" style={{fontSize:"34px"}}>Payment was successful!</h2>
            <h3 className="mb-3">Thank you for your purchase, {checkoutData.FirstName[0].toUpperCase() + checkoutData.FirstName.slice(1)} {checkoutData.LastName[0].toUpperCase() + checkoutData.LastName.slice(1)} </h3>
            <p style={{fontWeight:'600'}}>Customer Reference: {checkoutOrder?.customer_reference}</p>
            <h4>Your item(s) should arrive in 5-infinity business days</h4>
            <h5 style={{color:'red',marginBottom:'100px',marginTop:'100px'}}>*Disclaimer: Items may not arrive due to this being just a demo.</h5>
            <Link
              to="/"
              style={{
                  width:'20%',
                  fontSize:"20px",
                  backgroundColor:'white',
                  color:'black',
                  border:'2px solid black',}} 
                  className='btn-cart-banner' 
                  > Back to Home
            </Link> 
        </Container>
    </div>
  )
}
