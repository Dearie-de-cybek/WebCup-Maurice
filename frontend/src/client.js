import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Login
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Signup
export const signupUser = async (userData) => {
  const {name, email , password} = userData;
  await api.post("/auth/register",
    {name,
    email,
    password
  });
};

// Get Profile
export const getUserProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Logout
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
