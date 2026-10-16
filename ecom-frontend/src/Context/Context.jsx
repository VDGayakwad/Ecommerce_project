
import axios from "../axios";
import { useState, useEffect, createContext, useCallback } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  refreshData: async () => {},
  refreshCart: async () => {},
  clearCart: async () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState([]);

  // Fetch all products (public API)
  const refreshData = useCallback(async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
      setIsError("");
    } catch (error) {
      setIsError(
        error.response?.data?.message || error.message
      );
    }
  }, []);

  // Fetch cart belonging to the currently logged-in user
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    }
  }, []);

  // Add one unit of a product through the backend
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in to add products to your cart.");
    }

    try {
      await axios.post(
        `/cart/${product.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refreshCart();
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  // Remove a product from this user's database cart
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      await axios.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshCart();
    } catch (error) {
      console.error("Failed to remove product:", error);
      throw error;
    }
  };

  // Clear the database cart (not just the React state)
  const clearCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      await axios.delete("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    refreshData();
    refreshCart();

    // Refresh authentication-dependent cart when login/logout changes
    const handleAuthChanged = () => {
      refreshCart();
    };

    // Sync when another browser tab changes the token
    const handleStorage = (event) => {
      if (event.key === "token") {
        refreshCart();
      }
    };

    window.addEventListener("authChanged", handleAuthChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshData, refreshCart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
