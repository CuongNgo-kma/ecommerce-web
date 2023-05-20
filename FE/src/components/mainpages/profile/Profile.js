import React, { useEffect, useRef, useState } from "react";
import Loading from "../auth/Loading/Loading";
import axios from "axios";
import { useContext } from "react";
import { globalState } from "../../../globalState";
import { useParams } from "react-router-dom";

function Profile() {
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const state = useContext(globalState);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(false);
  const [token] = state.token;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [show, setShow] = useState(false)
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Size too large!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("File format is incorrect.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
      setUser({
        ...user,
        avatar: `${res.data.url}`,
      });
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!images) return alert("No Image Upload");
      console.log(user);
      await axios.patch(
        `http://localhost:5000/user/updateuser/${id}`,
        { name: user.name, avatar: user.avatar, email: user.email },
        {
          headers: { Authorization: token },
        }
      );
    } catch (err) {
      alert(err);
    }
  };
  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("You're not an admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  const loadProfileUser = async () => {
    const res = await axios.get("http://localhost:5000/user/infor", {
      headers: {
        Authorization: token,
      },
    });
    setUser({
      ...user,
      name: `${res.data.name}`,
      email: `${res.data.email}`,
    });

    console.log(res.data);
  };
  useEffect(() => {
    loadProfileUser();
  }, []);
    const showAddImage = ()=>{
        setShow(true)
    }
  return (
    <div className="create_product">
      <div className="upload">
        {show ? (
          <input type="file" name="file" id="file_up" onChange={handleUpload} />
        ) : (
          <img id="file_up" src={user.avatar} alt="Image" />
        )}
        {/* <input type="file" name="file" id="file_up" onChange={handleUpload} /> */}
              <button type="button" style={{}} onClick={showAddImage}>Add</button>


        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Name</label>
          <input
            type="text"
            name="name"
            id="product_id"
            required
            value={user.name}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="title"
            required
            value={user.email}
            onChange={handleChangeInput}
          />
        </div>

        {/* <div className="row">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        value={user.price}
                        onChange={handleChangeInput}
                    />
                </div> */}

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Profile;
