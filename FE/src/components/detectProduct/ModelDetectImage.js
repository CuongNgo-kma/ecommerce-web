import React, { useContext, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import { globalState } from "../../globalState";
import ProductItem from "../mainpages/ultils/ProductItem/ProductItem";
import Loading from "../mainpages/auth/Loading/Loading";

const ProductClassifier = () => {
  const [prediction, setPrediction] = useState("");
  const imageRef = useRef();
  const state = useContext(globalState);
  const [category, setCategory] = state.ProductAPI.category;
  const [categories] = state.CategoriesAPI.categories;
  const products = state.ProductAPI.product.product;
  const [isAdmin] = state.UserAPI.isAdmin;
  const loadModel = async () => {
    const model = await mobilenet.load();
    return model;
  };

  const classifyImage = async () => {
    const model = await loadModel();
    const img = imageRef.current;
    const tfImg = tf.browser.fromPixels(img);
    const resizedImg = tf.image.resizeBilinear(tfImg, [224, 224]);
    const processedImg = tf.cast(resizedImg, "float32");
    const batchedImg = processedImg.expandDims(0);
    const prediction = await model.classify(batchedImg);

    const arr = prediction[0].className.split(", ");
    const secondPhrase = arr[0];
    setPrediction(secondPhrase);
    for (let index = 0; index < categories.length; index++) {
      if (categories[index].name.toString() === secondPhrase.toString()) {
        setCategory("category=" + categories[index]._id);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      imageRef.current.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div style={{ marginBottom: 40 }}>
        <input type="file" onChange={handleImageUpload} />
        <button onClick={classifyImage}>Classify</button>
        <img ref={imageRef} alt="Uploaded" />
        {prediction && <p>Prediction: {prediction}</p>}
      </div>
      <div className="row">
        <div className="products">
          {products.map((product) => {
            return (
              <ProductItem
                key={product._id}
                product={product}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
        {products.length === 0 && <Loading />}
      </div>
    </>
  );
};

export default ProductClassifier;
