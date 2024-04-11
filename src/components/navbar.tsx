import { Nav } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { useAppContext } from "../context/appcontext"
import {cartImage} from '../assets/images/cartImage'

function Navbar() {
  const {cart} = useAppContext()
  // serach for item

  
// commerce.products.list({
//   query: 'bag',
// }).then(response => response.data);
  return (
   <Nav  className='justify-content-between align-items-center container p-2 mt-3'>
       {/* <div className="input-div">
     
        <input type="text" name='searchbar' placeholder="search" />
       </div> */}
       <div>
        <h1><span style={{color:'white',backgroundColor:'black',fontSize:'3rem'}}>S</span>hop & <span style={{color:'white',backgroundColor:'black',fontSize:'2.5rem'}}>D</span>rop</h1>
       </div>
       <div className="link-div">
       <Link to='/'>Home</Link>
        <a href="#">Sign-in</a>
        
        <Link to='/cart'>
          <div className='cart-div'>
         <img src={cartImage} alt="shopping cart" />
         {cart.length == 0 ? "": <span>{cart.length}</span>}
          </div>
          </Link>
       </div>
   </Nav>
       
  )
}

export default Navbar