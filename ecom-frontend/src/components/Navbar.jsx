
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTheme = () =>
    localStorage.getItem("theme") || "light-theme";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [user, setUser] = useState({
    isLoggedIn: false,
    role: null,
    email: null,
    name: null,
  });

  // Decode the JWT payload.
  const readUserFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        isLoggedIn: false,
        role: null,
        email: null,
        name: null,
      };
    }

    try {
      const base64Payload = token
        .split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const paddedPayload = base64Payload.padEnd(
        Math.ceil(base64Payload.length / 4) * 4,
        "="
      );

      const payload = JSON.parse(atob(paddedPayload));

      let role = payload.role || payload.authority || null;

      if (typeof role === "string") {
        role = role.replace(/^ROLE_/, "").toUpperCase();
      }

      return {
        isLoggedIn: true,
        role,
        email: payload.email || payload.sub || null,
        name: payload.name || payload.fullName || null,
      };
    } catch (error) {
      console.error("Unable to read JWT payload:", error);

      return {
        isLoggedIn: false,
        role: null,
        email: null,
        name: null,
      };
    }
  };

  // Update profile after navigation, login, or logout.
  useEffect(() => {
    const updateUser = () => {
      setUser(readUserFromToken());
    };

    updateUser();

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, [location.pathname]);

  // Load products for search.
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/products"
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);

    if (onSearch) {
      onSearch(value);
    }

    if (value.trim().length >= 1) {
      setShowSearchResults(true);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(
            value
          )}`
        );

        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching products:", error);
        setNoResults(false);
      }
    } else {
      setShowSearchResults(false);
      setNoResults(false);
      fetchData();
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const toggleTheme = () => {
    const newTheme =
      theme === "dark-theme" ? "light-theme" : "dark-theme";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser({
      isLoggedIn: false,
      role: null,
      email: null,
      name: null,
    });

    setShowProfile(false);
    window.dispatchEvent(new Event("authChanged"));

    navigate("/login", { replace: true });
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            EasyCart
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              {/* Only ADMIN can see Add Product */}
              {user.isLoggedIn && user.role === "ADMIN" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product">
                    Add Product
                  </Link>
                </li>
              )}

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </button>

                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              {!user.isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Sign in
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                /* Profile dropdown for logged-in users */
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-white"
                    type="button"
                    onClick={() => setShowProfile(!showProfile)}
                    aria-expanded={showProfile}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    Profile
                  </button>

                  {showProfile && (
                    <div
                      className="dropdown-menu dropdown-menu-end show p-3 text-dark"
                      style={{ minWidth: "230px" }}
                    >
                      <h6 className="mb-2">
                        {user.name || "My Profile"}
                      </h6>

                      <div className="small text-muted mb-2">
                        {user.email || "Email not available"}
                      </div>

                      <div className="mb-3">
                        <span className="text-muted small">
                          Role:{" "}
                        </span>

                        <span
                          className={`badge text-white ${
                            user.role === "ADMIN"
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                        >
                          {user.role || "Unknown"}
                        </span>
                      </div>

                      <hr />

                      <button
                        type="button"
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              )}
            </ul>

            <button
              className="btn btn-outline-secondary me-3"
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark-theme" ? (
                <i className="bi bi-sun-fill"></i>
              ) : (
                <i className="bi bi-moon-fill"></i>
              )}
            </button>

            <Link to="/cart" className="nav-link me-3">
              <i className="bi bi-cart me-1"></i>
              Cart
            </Link>

            <div
              className="position-relative"
              style={{ minWidth: "180px" }}
            >
              <input
                className="form-control"
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                value={input}
                onChange={(event) =>
                  handleChange(event.target.value)
                }
                onFocus={() => {
                  if (input.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSearchResults(false);
                  }, 200);
                }}
              />

              {showSearchResults && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{
                    zIndex: 1050,
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="list-group-item"
                      >
                        <Link
                          to={`/product/${result.id}`}
                          className="text-decoration-none"
                          onClick={() =>
                            setShowSearchResults(false)
                          }
                        >
                          {result.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    noResults && (
                      <li className="list-group-item">
                        No products found.
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
