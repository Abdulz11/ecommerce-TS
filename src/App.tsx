import Home from "./pages/home";
import ProductsPage from "./pages/productspage";
import AppLayout from "./pages/applayout";
import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/appcontext";
import Cart from "./pages/cart";
import Devices from "./pages/devices";
import Clothes from "./pages/clothes";
import Checkout from "./pages/checkoutpage/checkout";
import KitchenWares from "./pages/kitchenWares";
import Confirmation from "./pages/confirmation";
import Errorpage from "./pages/errorpage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import UploadProduct from "./pages/uploadProduct";
import Profile from "./pages/profile";
import { AuthContextProvider } from "./context/authContext";
import PrivateRoute from "./routes/PrivateRoute";
import EditProfile from "./pages/editProfile";
import EditProduct from "./pages/editProduct";
import CategoryPage from "./pages/categoryPage";
import AllCategoriesPage from "./pages/allCategoriesPage";
import StoreProductsPage from "./pages/storeProductsPage";

export function App() {
  return (
    <>
      <AppContextProvider>
        <AuthContextProvider>
          <Routes>
            <Route path='/' element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route
                path='upload'
                element={
                  <PrivateRoute allowedRoles={["STORE"]}>
                    <UploadProduct />
                  </PrivateRoute>
                }
              />
              <Route path='profile' element={<Profile />} />
              <Route path='/products' element={<CategoryPage />} />
              <Route path='/products/:productId' element={<ProductsPage />} />
              <Route
                path='/products/store_products/:storeId/:productId'
                element={<StoreProductsPage />}
              />
              <Route path='/categories' element={<AllCategoriesPage />} />
              <Route
                path='/store/edit_profile/:storeId'
                element={<EditProfile />}
              />
              <Route
                path='/products/edit_product/:productId'
                element={<EditProduct />}
              />
              <Route path='/cart' element={<Cart />} />
              <Route path='cart/checkout' element={<Checkout />} />

              <Route path='/clothes' element={<Clothes />} />
              <Route path='/devices' element={<Devices />} />
              <Route path='/kitchenwares' element={<KitchenWares />} />
              <Route path='/confirmation' element={<Confirmation />} />
            </Route>
            <Route path='/register' element={<Register />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='*' element={<Errorpage />} />
          </Routes>
        </AuthContextProvider>
      </AppContextProvider>
    </>
  );
}
