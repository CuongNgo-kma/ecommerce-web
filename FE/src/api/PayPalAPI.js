
let baseUrl = "https://api-m.sandbox.paypal.com";
const base64 = require("base-64");

let clientId =
    "AZHYlC41pBJuZcHvIwW5AdkdwTADnMLb17rAqv7zig6HzI7T96HPuxYAVTtiTq2h7mPww8xcpKfYQg8W";
let secretKey =
    "EAQd_MwIF5ACajzvuz6E7ZPLalxMX6_h2OkuYu-sm3vdExz6RkuArbwlJa-4l776sfm3UcheMFieg7VV";


const generateToken = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append(
        "Authorization",
        "Basic " + base64.encode(`${clientId}:${secretKey}`)
    );

    var requestOptions = {
        method: "POST",
        headers: headers,
        body: "grant_type=client_credentials",
    };
    return new Promise((resolve, reject) => {
        fetch(baseUrl + "/v1/oauth2/token", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log("result print: ", result);
                const { access_token } = JSON.parse(result);
                resolve(access_token);
            })
            .catch((error) => {
                console.log("error raised" + error);
                reject(error);
            });
    });
};

const createOrder = (token = "", order) => {
    var requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(order),
    };
    return new Promise((resolve, reject) => {
        fetch(baseUrl + "/v2/checkout/orders", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log("result print order: ", result);
                const res = JSON.parse(result);

                resolve(res);
                return result
            })
            .catch((error) => {
                console.log("error raised" + error);
                reject(error);
            });
    });
};

const checkOrderStatus = (orderId, token) => {
    var requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    
    };
    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${orderId}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log("result print order: ", result);
                const res = JSON.parse(result);

                resolve(res);
                return result
            })
            .catch((error) => {
                console.log("error raised" + error);
                reject(error);
            });
    });
};




export default {
    generateToken, createOrder, checkOrderStatus
};
