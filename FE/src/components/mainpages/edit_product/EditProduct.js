import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductItem from "../ultils/ProductItem/ProductItem";
import axios from "axios";
import { globalState } from "../../../globalState";

function EditProduct() {
  const params = useParams();
  const state = useContext(globalState);
  const token = state.token;
  const products = state.ProductAPI.product.product;
  const addCart = state.UserAPI.addCart;
  const [DetailProduct, setDetailProduct] = useState([]);
  const [isLogged] = state.UserAPI.isLogged;
  const id = params.id;
  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    content: "",
  });
  const [images, setImages] = useState(null);
  useEffect(() => {
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
  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { product },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeTitle = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleChangeImages = async (e) => {
    const x = e.target.files[0];
    setImages(x);
  };
 
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(images);
  if (images != null) {
    uploadFile(images);
  }
  return (
    <>
      <div className="detail">
        <img src={DetailProduct.images.url} alt="" />
        <div className="box-detail">
          <p>
            <input type="file" name="images" onChange={handleChangeImages} />
          </p>
          <p>
            Title{" "}
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChangeTitle}
              placeholder={DetailProduct.title}
            />
          </p>

          <p>
            id_product{" "}
            <input
              type="text"
              name="id_product"
              placeholder={DetailProduct.product_id}
              disabled
            />
          </p>
          <p>
            Price{" "}
            <input
              type="text"
              name="price"
              value={product.price}
              onChange={handleChangeTitle}
              placeholder={DetailProduct.price}
            />
          </p>
          <p>
            Description{" "}
            <input
              type="text"
              name="description"
              value={product.description}
              onChange={handleChangeTitle}
              placeholder={DetailProduct.price}
            />
          </p>
          <p>
            Category{" "}
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChangeTitle}
              placeholder={DetailProduct.price}
            />
          </p>
          <p>
            Content{" "}
            <input
              type="text"
              name="content"
              value={product.content}
              onChange={handleChangeTitle}
              placeholder={DetailProduct.price}
            />
          </p>
          <p>Sold: {DetailProduct.sold}</p>
          <button onClick={() => updateProduct()} className="cart">
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
