import React, {useContext} from 'react'
import {globalState} from '../../../globalState'
import ProductItem from '../ultils/ProductItem/ProductItem';
import Loading from '../auth/Loading/Loading';


function Products() {
    const state = useContext(globalState)
    const products = state.ProductAPI.product.product
    const [isAdmin] = state.UserAPI.isAdmin 
    
    return (
        <>
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