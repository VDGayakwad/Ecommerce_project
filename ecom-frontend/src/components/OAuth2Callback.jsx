import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(
      window.location.hash.substring(1)
    ).get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("api/products", { replace: true });
    } else {
      navigate("/login", {
        replace: true,
        state: {
          notice: "Google login failed. Please try again.",
        },
      });
    }
  }, [navigate]);

  return <p>Completing Google login...</p>;
};

export default OAuth2Callback;