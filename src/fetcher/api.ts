import axios from "axios";

export const taskMirrorApi = axios.create({
  baseURL: "https://task-mirror-api-java.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

taskMirrorApi.interceptors.request.use(async (config: any) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }
  return config;
});
