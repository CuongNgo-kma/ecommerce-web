import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
// import url from "./api/url";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";

export const globalState = createContext();
export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.get("/user/refresh_token");
        setToken(res.data.accesstoken);
        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    ProductAPI: ProductAPI(),
    UserAPI: UserAPI(token),
    CategoriesAPI: CategoriesAPI(),
    
  };
  return <globalState.Provider value={state}>{children}</globalState.Provider>;
};
