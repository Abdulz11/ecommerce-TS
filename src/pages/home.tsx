import Categories from '../components/categories'
import Slider from '../components/slider'
import Products from '../components/products'
import Newsletter from '../components/newsletter'
import Footer from '../components/footer'
import {useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../context/appcontext'


function Home() {
  const {setPath} = useAppContext()

  let {pathname} = useLocation()
  useEffect(()=>{
    setPath(pathname)
  },[])


 

  return (
    <>
      <Slider/>
      <Categories/>
      <Products/>
      <Newsletter/>
      <Footer/>
    </>
  )
}

export default Home