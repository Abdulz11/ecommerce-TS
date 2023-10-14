import {Outlet} from 'react-router-dom'
import Navbar from '../components/navbar'

function AppLayer() {
  return (
    <>
     <Navbar/>
      <Outlet/>
    </>
   
  )
}

export default AppLayer