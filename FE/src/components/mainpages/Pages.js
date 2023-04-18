import React, { useContext } from "react";
import Products from "./products/Products";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Cart from "./cart/Cart";
import { Routes, Route } from "react-router-dom";
import NotFound from "./ultils/NotFound/NotFound";
import DetailProduct from "./DetailProduct/DetailProduct";
import { globalState } from "../../globalState";

function MainPages() {
  const state = useContext(globalState);
  const [isLogged] = state.UserAPI.isLogged;

  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/detail/:id" element={<DetailProduct />} />
      <Route path="/login" element={isLogged ? <NotFound /> : <Login />} />
      <Route path="/register" element={isLogged? <NotFound/> : <Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MainPages;
