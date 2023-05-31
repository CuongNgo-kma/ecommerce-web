import React, {useContext, useState} from 'react'
import {globalState} from '../../../globalState'
import ProductItem from '../ultils/ProductItem/ProductItem';
import Loading from '../auth/Loading/Loading';
import Filters from './Filters';


function Products() {
    const state = useContext(globalState)
    const products = state.ProductAPI.product.product
    const [isAdmin] = state.UserAPI.isAdmin 
    const [search, setSearch] = useState()
    return (
        <>
        <Filters/>
        <div className="products">
            {
                products.map(product =>{
                    return <ProductItem key={product._id} product={product} isAdmin={isAdmin}/>
                })
            }
        

        </div>
        {products.length ===0 && <Loading/>}
        </>
    )
}

export default Products