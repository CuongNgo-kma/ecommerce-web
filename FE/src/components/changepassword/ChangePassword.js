import axios from "axios";
import React, { useContext, useState } from "react";
import { globalState } from "../../globalState";
import { useParams } from "react-router-dom";

function ChangePassword() {
  const param = useParams();
  const { id } = param;
  const state = useContext(globalState);
  const [token] = state.token;
  const [user, setUser] = useState({
    oldpass: "",
    newpass: "",
    rewritepass: "",
  });
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem("email");
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email: email,
        password: user.oldpass,
      });
      if (res.status === 200) {
        if (user.newpass !== user.rewritepass && user.newpass.length < 6) {
          alert("Mật khẩu mới và mật khẩu nhập lại không khớp!");
        } else {
          await axios.patch(
            `http://localhost:5000/user/password/${id}`,
            { password: user.newpass },
            {
              headers: {
                Authorization: res.data.accesstoken,
              },
            }
          );
          alert("Đổi mật khẩu thành công!");
        }
      } else {
        alert("Đã xảy ra lỗi!")
      }
    } catch (error) {
        alert(error)
    }

    // if (res.data.status ===200) {

    // }
  };
  return (
    <div className="create_product">
      <form>
        <div className="row">
          <label htmlFor="product_id">Old pass</label>
          <input
            type="password"
            name="oldpass"
            id="product_id"
            required
            value={user.oldpass}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="email">New password</label>
          <input
            type="password"
            name="newpass"
            id="title"
            required
            value={user.newpass}
            onChange={handleChangeInput}
          />
        </div>
        {user.newpass.length<6?<p style={{color:"red"}}>Mật khẩu quá ngắn</p>:null}
        <div className="row">
          <label htmlFor="email">Rewrite your password</label>
          <input
            type="password"
            name="rewritepass"
            id="title"
            required
            value={user.rewritepass}
            onChange={handleChangeInput}
          />
        </div>
              {user.rewritepass !== user.newpass ? <p style={{ color: "red" }}>Mật khẩu đã nhập không khớp</p>:null}
        {/* {
    user.newpass===user.rewritepass?null:alert("Mật khẩu mới không khớp!")
}
       */}

        <button type="button" onClick={handleSubmit}>
          Change password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
