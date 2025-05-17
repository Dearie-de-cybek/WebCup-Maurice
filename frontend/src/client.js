import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Login
export const signInUser = async (userData) => {
  const { email, password } = userData;
  try {
    const response = await api.post("/auth/login", { email, password });
    const res = response.data; 
    return res
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    alert(`Login failed: ${errorMessage}`);
    return null;
  }
};

// Signup
export const signUpUser = async (userData) => {
  const {name, email , password} = userData;
   try {
    const res = await api.post("/auth/register", {name, email, password });
    return res
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    alert(`Sign Up failed: ${errorMessage}`);
    return null;
  }
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
