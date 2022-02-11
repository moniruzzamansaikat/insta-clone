import { authToken } from "./../util";
import axios from "axios";

const BASE_URL = `http://localhost:5555`;

export const xhr = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `jwt ${authToken()}`,
  },
});
