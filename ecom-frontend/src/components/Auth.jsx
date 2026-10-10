import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../axios";
import "./Auth.css";

const Auth = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(location.state?.notice || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };
      const response = await API.post(endpoint, payload);

      setIsError(false);
      if (isRegister) {
        navigate("/login", { state: { notice: response.data } });
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      const responseMessage = error.response?.data;
      setIsError(true);
      setMessage(
        typeof responseMessage === "string"
          ? responseMessage
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="auth-eyebrow">EasyCart account</p>
        <h1 id="auth-title">{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="auth-intro">
          {isRegister
            ? "Sign up to get started with EasyCart."
            : "Sign in with your email and password."}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-field">
              <span>Name</span>
              <input
                autoComplete="name"
                name="name"
                onChange={handleChange}
                required
                value={form.name}
              />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete={isRegister ? "new-password" : "current-password"}
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={form.password}
            />
          </label>

          {message && (
            <p className={`auth-message ${isError ? "is-error" : "is-success"}`} role="status">
              {message}
            </p>
          )}

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already registered? " : "New to EasyCart? "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Auth;