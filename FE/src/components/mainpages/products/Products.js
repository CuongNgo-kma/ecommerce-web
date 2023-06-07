import React, { useContext, useState } from 'react'

import axios from 'axios'
import ProductItem from '../ultils/ProductItem/ProductItem'
import Filters from '../products/Filters'
import Loading from '../auth/Loading/Loading'
import LoadMore from './LoadMore'
import { globalState } from '../../../globalState'


function Products() {
    const state = useContext(globalState)
    const [products, setProducts] = state.ProductAPI.products
    const [isAdmin] = state.UserAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.ProductAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', { public_id }, {
                headers: { Authorization: token }
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    if (loading) return <div><Loading /></div>
    return (
        <>
            <Filters />

            {
                isAdmin &&
                <div className="delete-all">
                    <span>Select all</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Delete ALL</button>
                </div>
            }

            <div className="products">
                {
                    products.map(product => {
                        return <ProductItem key={product._id} product={product}
                            isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    })
                }
            </div>

            <LoadMore />
            {products.length === 0 && <Loading />}
        </>
    )
}

export default Products