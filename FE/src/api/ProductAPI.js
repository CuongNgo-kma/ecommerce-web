import { useState, useEffect } from 'react'
import axios from 'axios';
// import url from './url';

function ProductAPI() {
  const [product, setProduct] = useState([])
  const getProducts = async () => {
    try {
      const res = await axios.get("/api/products")
     
      setProduct(res.data.products)
    } catch (error) {
      console.log("connect fail");
    }
  }
  useEffect(() => {
    getProducts()
  }, [])

  return {
    product: { product, setProduct }
  }
}

export default ProductAPI