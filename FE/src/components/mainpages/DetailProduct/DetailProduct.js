import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { globalState } from "../../../globalState";
import ProductItem from "../ultils/ProductItem/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(globalState);
  const products = state.ProductAPI.product.product;
  const addCart = state.UserAPI.addCart;
  const [DetailProduct, setDetailProduct] = useState([]);
  const [isLogged] = state.UserAPI.isLogged

  

  useEffect(() => {
    console.log("re render");
    console.log(params);
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) {
          setDetailProduct(product);
        }
      });
    }
  }, [params.id, products]);

  if (DetailProduct.length === 0) {
    return null;
  }
  return (
    <>
      <div className="detail">
        <img src={DetailProduct.images.url} alt="" />
        <div className="box-detail">
          <div className="row">
            <h2> {DetailProduct.title}</h2>
            <h6> {DetailProduct.product_id}</h6>
          </div>
          <span>${DetailProduct.price}</span>
          <p>{DetailProduct.description}</p>
          <p>{DetailProduct.content}</p>
          <p>Sold: {DetailProduct.sold}</p>
          <Link
            to="/cart"
            className="cart"
            onClick={() => addCart(DetailProduct)}
          >
            Buy now
          </Link>
        </div>
      </div>
      <div>
        <h2>Realate products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === DetailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
