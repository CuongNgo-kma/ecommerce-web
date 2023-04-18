import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { globalState } from "../../../globalState";
import url from "../../../api/url";
// import PaypalButton from './PaypalButton'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
function Cart() {
  const state = useContext(globalState);
  const [cart, setCart] = state.UserAPI.cart;
  const [total, setTotal] = useState(0);
  const [token] = state.token;
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErorMessage] = useState("");
  const [orderId, setOrderId] = useState(false);
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: 'This is the Book Worth 10'
          ,
          amount: {
            currency_code: 'USD',
            value: total
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    })
      .then((orderID) => {
        setOrderId(orderID)
        return orderID
      })
  }

  const onApprove = (data, actions) => {
    resetCart()
    return actions.order.capture().then(function (details) {
      const { payer } = details
      setSuccess(true)
    })
  }

  const onError = (data, actions)=>{
    setErorMessage("An error occured with your payment")

  }
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };
  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };
  const deincrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };
  const removeProduct = (id) => {
    if (window.confirm("Do you want delete this product from cart?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addToCart(cart);
    }
  };

  if (cart.length === 0) {
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
    );
  }
  const resetCart =async () =>{
    try {
      await axios.patch('http:// 192.168.0.103:5000/user/delelecart', {cart: []}, {
        headers: {
          Authorization: token
        }
      })
    } catch (error) {
      console.log("lỗi");
    }
  }
  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />
          <div className="box-detail">
            <div className="row">
              <h2> {product.title}</h2>
              <h6>#id: {product.product_id}</h6>
            </div>
            <h3>${product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>
            <div className="amount">
              <button onClick={() => deincrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: $ {total}</h3>
        <div style={{marginTop: 40}}>
          <PayPalScriptProvider
            options={{
              "client-id":
                "AdxT526hIJouy9lb5X3QJ3oWDJgqnzvHglJhDPM8Ra_RSDZZAMsd44jLGsUJOheBwMQwOEX9R2jgt0dg",
            }}
          >
            <button
              onClick={() => {
                setShow(true);
              }}
              type="submit"
            >
              Buy now
            </button>
            {show ? (
              <PayPalButtons
                style={{ layout: "vertical", }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            ) : null}
            {
              success?(alert("payment success!")):(<h1>Fail to pay</h1>)
            }
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
export default Cart;
