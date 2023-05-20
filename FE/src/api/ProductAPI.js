import { useState, useEffect } from 'react'
import axios from 'axios';
// import url from './url';

function ProductAPI() {
  const [product, setProduct] = useState([])
  const [callback, setCallback] = useState(false)
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(0)
  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(`/api/products?limit=${page * 9}&${category}&${sort}&title[regex]=${search}`)
      setProduct(res.data.products)
      setResult(res.data.result)
    }
    getProducts()
  }, [callback, category, sort, search, page])

  return {
    product: { product, setProduct },
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult]
  }
}

export default ProductAPI