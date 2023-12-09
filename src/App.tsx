import Home from './pages/home'
import ProductsPage from './pages/productspage'
import AppLayer from './pages/applayer'
import {Routes,Route} from 'react-router-dom'
import { AppContextProvider } from './context/appcontext'
import Cart from './pages/cart'
import Devices from './pages/devices'
import Clothes from './pages/clothes'
import Checkout from './pages/checkoutpage/checkout'
import KitchenWares from './pages/kitchenWares'
import Confirmation from './pages/confirmation'
import Errorpage from './pages/errorpage'

export function App() {
  // let _KEY = 'pk_52865dedc1a89387297b115dd8dd0a1f8cc9537c5710c'

  return (
    <>
    <AppContextProvider>
      <Routes>
        <Route path='/' element={<AppLayer/>}>
          <Route index element={<Home/>}/>
          <Route path='/product/:id' element={<ProductsPage/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='cart/checkout' element={<Checkout/>}/>
        <Route path='/clothes' element={<Clothes/>}/>
        <Route path='/devices' element={<Devices />}/>
        <Route path='/kitchenwares' element={<KitchenWares/>}/>
        <Route path='/confirmation' element={<Confirmation/>}/>
        <Route path='*' element={<Errorpage/>}/>
      </Routes>
    </AppContextProvider>
      
    </>
  )
}


