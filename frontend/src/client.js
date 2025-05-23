import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Login
export const signInUser = async (userData) => {
  const { email, password } = userData;
  try {
    const response = await api.post("/auth/login", { email, password });
    const user = response.data;

    // Store user data and token in local storage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);

    return user;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || "Login failed";
    alert(`Login failed: ${errorMessage}`);
    console.error("Login failed:", errorMessage);
    return null;
  }
};

// Signup
export const signUpUser = async (userData) => {
  console.log(userData)
  const {name, email , password} = userData;
   try {
    const res = await api.post("/auth/register", {name, email, password });
    return res
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    alert(`Sign Up failed: ${errorMessage}`);
    return null;
  }
};

// Get Profile
export const getUserPages = async (token) => {
    try {
    const response = await api.get("/pages/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.pages
  } catch (error) {
    throw error.response?.data || error;
  }
  
};

// Logout
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};