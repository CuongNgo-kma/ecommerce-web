import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { globalState } from "../../../globalState";
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
  const listItems = cart.map((product) => ({
    name: product.title,
    description: product.description,
    quantity: product.quantity.toString(),
    unit_amount: {
      currency_code: "USD",
      value: product.price.toString(),
    },
  }));
  // console.log(listItems);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: total,
                },
              },
            },
            items: listItems,
            shippingPreference: "SET_PROVIDED_ADDRESS",
            // Thêm địa chỉ mặc định ở đây
            shipping: {
              name: {
                full_name: "Cuong KMA",
              },
              address: {
                address_line_1: "Số 16, ngõ 143 đường Chiến Thắng ",
                admin_area_2: "Thanh Trì",
                admin_area_1: "Hà Nội",
                postal_code: "100000",
                country_code: "VN",
              },
            },
            address_override: 1,
          },
        ],
        application_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
          user_action: "PAY_NOW",
        },
      })
      .then((orderID) => {
        setOrderId(orderID);
        return orderID;
      });
  };

  const onApprove = async (data, actions) => {
    // console.log(data);

    return actions.order.capture().then(function (details) {
      console.log(details);
      const { id, purchase_units } = details;
      const { shipping } = purchase_units[0];
      console.log(id);
      console.log(shipping);
      addPayment(id, shipping);
      setSuccess(true);
      resetCart();
    });
  };
  const addPayment = async (id, shipping) => {
    await axios
      .post(
        "api/payment",
        { paymentID: id, cart: cart, address: shipping },
        {
          headers: { Authorization: token },
        }
      )
      .catch(() => {
        console.log("lỗi");
      });
    console.log("ok");
  };
  const onError = (data, actions) => {
    setErorMessage("An error occured with your payment");
  };
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
  const reloadPgae = () => {
    window.location.reload();
    // alertPayment();
    // window.location.reload()
  };

  const alertPayment = () => {
    alert("You have success placed an order.");
  };
  // if (true) {
  //   alertPayment()
  // }
  const resetCart = async () => {
    try {
      await axios.patch(
        "user/deletecart",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log("lỗi");
    }
  };
  const paypalOptions = {
    flow: "checkout",
    useraction: "continue",
  };
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
        <div style={{ marginTop: 40 }}>
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
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            ) : null}
            {success ? reloadPgae() : <h1>Fail to pay</h1>}
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
export default Cart;
