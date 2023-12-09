import { Link } from "react-router-dom"

export default function Errorpage() {
  return (
    <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
    <h2 style={{fontSize:'40px',margin:'100px 0px'}}>Oops, Something went wrong.</h2>
    <Link
    to="/"
       style={{
           width:'20%',
           fontSize:"20px",
           backgroundColor:'white',
           color:'black',
           border:'2px solid black',
           }} 
           className='btn-cart-banner' 
          >Go To Home
       </Link> 
    </div> 
  )
}
