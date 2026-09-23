import Home from "./pages/home";
import ProductsPage from "./pages/productspage";
import AppLayout from "./pages/applayout";
import { Routes, Route } from "react-router-dom";
import Cart from "./pages/cart";
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
import { AppContextProvider } from "./context/appContext";

export function App() {
  return (
    <>
      <AppContextProvider>
        <AuthContextProvider>
          <Routes>
            {/* authentication pages */}
            <Route path='/register' element={<Register />} />
            <Route path='/signin' element={<SignIn />} />

            {/* rest of the app */}
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
              <Route
                path='profile'
                element={
                  <PrivateRoute allowedRoles={["STORE", "CUSTOMER"]}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path='/products' element={<CategoryPage />} />
              <Route path='/products/:productId' element={<ProductsPage />} />
              {/* <Route path='store/products/:productId' element={<ProductsPage />} /> */}
              <Route
                path='/store/:storeId/products/:productId'
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
              <Route path='/confirmation' element={<Confirmation />} />
            </Route>

            <Route path='*' element={<Errorpage />} />
          </Routes>
        </AuthContextProvider>
      </AppContextProvider>
    </>
  );
}
