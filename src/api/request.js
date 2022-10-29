import axios from "axios";
import qs from "querystringify";

if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NzAxMzkzNDc3MiwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.5xXH_xFLgky7GXUlgZkwG-kmc8q_I3g7cxF3iowa6wg";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NzAxMzkzNDc3M30.vKyFvWy6R4K7sqdKJfBBlQwVPaBuF6xY9Q0UzaqEgVs";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  document.cookie = "JSESSIONID=D2012FF85B626ADD2958913BC2F5CD92";
  document.cookie = "XSRF-TOKEN=6daf38f3-43c6-4aa8-82af-c3820e7f74cc";
}

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
      window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (response) => {
    let { data } = response;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }

    response.data = data && data.result;
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
