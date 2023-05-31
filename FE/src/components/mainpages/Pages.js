import React, { useContext } from "react";
import Products from "./products/Products";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Cart from "./cart/Cart";
import { Routes, Route } from "react-router-dom";
import NotFound from "./ultils/NotFound/NotFound";
import DetailProduct from "./DetailProduct/DetailProduct";
import { globalState } from "../../globalState";
// import SearchByImages from "../searchByImage/SearchByImages";
import OrderHistory from "./history/OrderHistory ";
import OrderDetails from "./history/OrderDetails";
import CreateProduct from "./createProduct/CreateProduct";
import Categories from "./category/Categories";
import EditProduct from "./edit_product/EditProduct";
import ProductClassifier from '../detectProduct/ModelDetectImage'
import Profile from "./profile/Profile";
import ChangePassword from "../changepassword/ChangePassword";

function MainPages() {
  const state = useContext(globalState);
  const [isLogged] = state.UserAPI.isLogged;
  const [isAdmin] = state.UserAPI.isAdmin

  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/detail/:id" element={<DetailProduct />} />
      <Route path="/login" element={isLogged ? <NotFound /> : <Login />} />
      <Route path="/register" element={isLogged? <NotFound/> : <Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/history" element={isLogged ? <OrderHistory />:<NotFound/>} />
      <Route path="/history/:id" element={isLogged ? <OrderDetails /> : <NotFound />} />
      <Route path="/create_product" element={isLogged && isAdmin ? <CreateProduct /> : <NotFound />} />
      <Route path="/edit_product/:id" element={isLogged && isAdmin ? <CreateProduct /> : <NotFound />} />
      <Route path="/category" element={isLogged && isAdmin ? < Categories /> : <NotFound />} />
      <Route path="/find-relate-product" element={isLogged ? <ProductClassifier /> : <NotFound />} />
      <Route path="/profile/:id" element={isLogged ? <Profile /> : <NotFound />} />
      <Route path="/user/password/:id" element={isLogged ? <ChangePassword /> : <NotFound />} />

      {/* <Route path="/products/:id" element={isLogged && isAdmin ? <EditProduct /> : <NotFound />} /> */}
      
    </Routes>
  );
}

export default MainPages;
