import axios from 'axios'
import React, { useEffect, useState } from 'react'

function CategoriesAPI() {
    const [categories, setCategories] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(()=>{
        const getCategories = async ()=>{
          const res = await axios.get(`/api/category`)
            console.log(res);
            setCategories(res.data)
        }
        getCategories()
    },[])

  return {
    categories: [categories, setCategories],
      callback: [callback, setCallback]
}
}

export default CategoriesAPI