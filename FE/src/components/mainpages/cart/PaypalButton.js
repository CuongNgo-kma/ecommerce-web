import React, { useContext, useState } from "react";
import PayPalAPI from "../../../api/PayPalAPI";
import url from "../../../api/url";
import axios from "axios";
import { globalState } from "../../../globalState";

function PaypalButton({ total }) {
  const [saveToken, setSaveToken] = useState("");
  const [idPayment, setIdPayment] = useState("");
  const state = useContext(globalState);
  const getCart = state.UserAPI.cart;
  const tokenUser = state.token;
  const [cart, setCart] = state.UserAPI.cart;

  const listItems = getCart[0].map((product) => ({
    name: product.title,
    description: product.description,
    quantity: product.quantity.toString(),
    unit_amount: {
      currency_code: "USD",
      value: product.price.toString(),
    },
  }))

  // console.log(tokenUser[0]);

  const onPressPaypal = async () => {
    try {
      let ordersDetails = {
        intent: "CAPTURE",
        purchase_units: [
          {
            items: listItems,
            amount: {
              currency_code: "USD",
              value: `${total}`,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: `${total}`,
                },
              },
            },
          },
        ],
        application_context: {
          return_url: "http://localhost:5000/success",
          cancel_url: "http://localhost:5000/cancel",
        },
      };
      const token = await PayPalAPI.generateToken();
      const res = await PayPalAPI.createOrder(token, ordersDetails).then(
        (result) => {
          //
          return result;
        }
      );
      setIdPayment(res.id);
      setSaveToken(token);
      // await axios.post(`${res.links[3].href}`).then(result=>console.log(result))

      console.log(res);

      window.open(res.links[1].href);
    } catch (error) {
      console.log("erroo" + error);
    }
  };
  const checkPayment = async () => {
    // console.log(getCart[0]);
    console.log(listItems.length);
    try {
      const paymentResult = await PayPalAPI.checkOrderStatus(
        idPayment,
        saveToken
      );
      console.log(paymentResult);

      if (paymentResult.status === "APPROVED") {
        const {
          id,
          purchase_units: [
            {
              items: [item],
            },
          ],
        } = paymentResult;
        const {
          purchase_units: [{ shipping }],
        } = paymentResult;
        await axios.post(
          "/api/payment",
          { cart: item, paymentID: id, address: shipping },
          {
            headers: { Authorization: tokenUser[0] },
          }
        );

        await axios.patch('/user/deletecart', {}, {
          headers: { Authorization: tokenUser[0] }
        })


        alert(
          "Thanh toán thành công, bạn có thể xoá sản phẩm khỏi giỏ hàng nếu muốn !"
        );
      } else {
        alert(
          "Thanh toán thất bại, vui lòng kiểm tra lại hoặc liên hệ hotline 0836668886 ! mã đơn hàng " +
          paymentResult.id
        );
      }
    } catch (error) {
      alert("Bạn chưa tạo thanh toán!");
    }
  };





  return (
    <div className="btn-payment">
      <button onClick={onPressPaypal}>Payment</button>
      <button onClick={checkPayment}>check payment</button>
    </div>
  );
}

export default PaypalButton;