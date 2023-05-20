import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { globalState } from '../../../globalState'
import axios from 'axios'

function OrderDetails() {
    const state = useContext(globalState)
    const [history] = state.UserAPI.history
    const [token] = state.token
    const [orderDetails, setOrderDetails] = useState([])
    const [isAdmin] = state.UserAPI.isAdmin

    const params = useParams()
    // useEffect(() => {
    //     if (params.id) {
    //         history.forEach(item => {
    //             if (item._id === params.id) {
    //                 setOrderDetails(item)
    //             }
    //         })
    //     }
    // }, [params.id, history])
    useEffect(()=>{
        getHistoryDetail()
    },[])
    const getHistoryDetail = async() =>{
        if (isAdmin) {
            const res = await axios.get('/api/payment', {
                headers: { Authorization: token }
            })
            res.data.map(
                item => {
                    if (item._id === params.id) {
                        setOrderDetails(item)
                    }
                }
            )
        }
        else {
            const res = await axios.get('/user/history', {
                headers: { Authorization: token }
            })
            res.data.map(
                item => {
                    if (item._id === params.id) {
                        setOrderDetails(item)
                    }
                }
            )
        }
    }
    if (orderDetails.length === 0) return null;
    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Country Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetails.name}</td>
                        <td>{orderDetails.address.address.address_line_1 + " - " + orderDetails.address.address.admin_area_1 + " - " + orderDetails.address.address.admin_area_2 }</td>
                        <td>{orderDetails.address.address.postal_code}</td>
                        <td>{orderDetails.address.address.country_code}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{ margin: "30px 0px" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map(item => (
                            <tr key={item._id}>
                                <td><img src={item.images.url} alt="" /></td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>$ {item.price * item.quantity}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export default OrderDetails