import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { globalState } from "../../../../globalState";
import axios from "axios";
function BtnRender({ product }) {
  const state = useContext(globalState);
  const [isAdmin] = state.UserAPI.isAdmin;
  const addCard = state.UserAPI.addCart;
  const [token] = state.token
  const deleteProduct = async() =>{
    console.log(product._id);
    
    try {
      
      const confirmed = window.confirm(`Bạn có chắc muốn xoá  "${product.title}"`);
      if (confirmed) {
        await axios.delete(`api/products/${product._id}`, {
          headers: {
            Authorization: token
          }
        })
      window.location.reload()
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi");
    }
  }
  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link id="btn_buy" to="#!" onClick={deleteProduct}>
            Delete
          </Link>
          <Link id="btn_view" to={`/edit_product/${product._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_buy" onClick={() => addCard(product)} to="#!">
            Buy
          </Link>
          <Link id="btn_view" to={`/detail/${product._id}`}>
            View
          </Link>
        </>
      )}
    </div>
  );
}

export default BtnRender;
