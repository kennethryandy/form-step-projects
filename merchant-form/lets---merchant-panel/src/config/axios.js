import axios from "axios";

const instance = axios.create({
  // baseURL:
  baseURL: "http://localhost:8093",
});

export default instance;
