import axios from "axios";
import { appConfig } from "./app";

const http = axios.create({
  baseURL: appConfig.apiUrl,
});

export default http;
