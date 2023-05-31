import React, { useEffect, useState } from "react";
import { globalState } from "../../globalState";
import { useContext } from "react";
import Menu from "./icon/bars-solid.svg";
import Cart from "../headers/icon/cart-plus-solid.svg";
import Close from "../headers/icon/circle-xmark-solid.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function Header() {
  const state = useContext(globalState);
  // console.log(state);
  const [isLogged] = state.UserAPI.isLogged;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [cart] = state.UserAPI.cart;
  const [userId] = state.UserAPI.userId;
  const [token] = state.token;
  const [name] = state.UserAPI.name
  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/find-relate-product">FindProduct</Link>
        </li>
        <li>
          <Link to="/history">history</Link>
        </li>
        <li>
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };
 

  return (
    <header>
      <div className="menu">
        <img src={Menu} width="30" alt="" />
      </div>

      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : `Welcome ${name}`}</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
        </li>
        <li>
          <Link to={`/profile/${userId}`}>Profile</Link>
        </li>

        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Login + Register</Link>
          </li>
        )}

        <li>
          <img src={Close} alt="" width="30" className="menu" />
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
