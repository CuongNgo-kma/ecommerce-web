import axios from 'axios'
import { useEffect, useState } from 'react'


function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])
    const [userId, setUserId] = useState('')
    const [name, setName] = useState('')
    useEffect(()=>{
        if (token) {
            const getUser =async ()=>{
                try {
                    const res = await axios.get('/user/infor',{
                        headers: {Authorization: token}
                    })
                    setIsLogged(true)
                    res.data.role ===1?setIsAdmin(true):setIsAdmin(false)
                    setCart(res.data.cart)
                    
                } catch (error) {
                    alert(error.response.data.msg)
                }
            }
            getUser()
            
        }
    },[token])
    useEffect(()=>{
        if (token) {
            const getHistory = async()=>{
                const res = await axios.get('/user/history', {
                    headers: {
                        Authorization: token
                    }
                })
                const nhung = await axios.get('/user/infor', {
                    headers:{
                        Authorization: token
                    }
                })
                setUserId(nhung.data._id)
                setName(nhung.data.name)
                // console.log(res);
            }
            getHistory()
        }
        
    },[token])
    const addCart = async (product) => {
        console.log(isLogged);
        if (!isLogged) {
            return alert("Please login to continue buying")
        }

        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])

            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })

        } else {
            alert("This product has been added to cart.")
        }
    }
    
  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    history: [history, setHistory],
    addCart: addCart,
    userId: [userId, setUserId],
    name: [name, setName]
  }
}

export default UserAPI