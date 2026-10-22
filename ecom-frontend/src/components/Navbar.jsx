import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navbarStyles = `
  body.light-theme {
    --nav-bg: rgba(255, 255, 255, 0.85);
    --nav-text: #1f2937;
    --nav-muted: #6b7280;
    --nav-border: rgba(0, 0, 0, 0.08);
    --nav-hover: rgba(99, 102, 241, 0.1);
    --nav-card: #ffffff;
    --nav-input: #f3f4f6;
  }
  body.dark-theme {
    --nav-bg: rgba(17, 24, 39, 0.85);
    --nav-text: #f3f4f6;
    --nav-muted: #9ca3af;
    --nav-border: rgba(255, 255, 255, 0.08);
    --nav-hover: rgba(129, 140, 248, 0.18);
    --nav-card: #1f2937;
    --nav-input: #111827;
  }
  :root {
    --accent: #6366f1;
    --accent-2: #ec4899;
  }

  .ec-navbar {
    background: var(--nav-bg, rgba(255,255,255,0.85)) !important;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--nav-border);
    box-shadow: 0 4px 24px rgba(236, 212, 247, 0.06);
    padding: 0.6rem 1rem;
    transition: background 0.3s ease;
  }

  .ec-navbar .navbar-brand {
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: transform 0.2s ease;
  }
  .ec-navbar .navbar-brand:hover { transform: scale(1.05); }

  .ec-navbar .nav-link {
    color: var(--nav-text) !important;
    font-weight: 500;
    position: relative;
    border-radius: 8px;
    padding: 0.5rem 0.9rem !important;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .ec-navbar .nav-link:hover {
    background: var(--nav-hover);
    color: var(--accent) !important;
  }
    /* Underline only for plain links (Home, Add Product, Sign in, Register, Cart) */
  .ec-navbar a.nav-link::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 2px;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transition: all 0.25s ease;
    transform: translateX(-50%);
  }
  .ec-navbar a.nav-link:hover::after { width: 55%; }

  /* Dropdown buttons (Categories, Profile): keep Bootstrap's normal caret, no line */
  .ec-navbar button.dropdown-toggle::after {
    content: "";
    display: inline-block;
    position: static;
    width: 0;
    height: 0;
    margin-left: 0.4em;
    vertical-align: 0.15em;
    background: none;
    transform: none;
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
  .ec-navbar .btn-link { text-decoration: none; }

  .ec-navbar .dropdown-menu {
    background: var(--nav-card);
    border: 1px solid var(--nav-border);
    border-radius: 14px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    padding: 0.5rem;
    animation: ecFadeDown 0.2s ease;
  }
  .ec-navbar .dropdown-item {
    color: var(--nav-text);
    border-radius: 8px;
    padding: 0.5rem 0.9rem;
    transition: all 0.15s ease;
  }
  .ec-navbar .dropdown-item:hover {
    background: var(--nav-hover);
    color: var(--accent);
    transform: translateX(4px);
  }
  .ec-navbar .dropdown-item.text-danger:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
  }

  .ec-profile-menu {
    color: var(--nav-text) !important;
    min-width: 250px !important;
  }
  .ec-profile-menu h6 { font-weight: 700; color: var(--nav-text); }
  .ec-profile-menu .text-muted { color: var(--nav-muted) !important; }
  .ec-profile-menu hr { border-color: var(--nav-border); }
  .ec-profile-menu .badge {
    border-radius: 999px;
    padding: 0.35em 0.8em;
    letter-spacing: 0.5px;
  }

  .ec-navbar .btn-outline-secondary {
    width: 40px;
    height: 40px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--nav-border);
    color: var(--nav-text);
    background: var(--nav-input);
    transition: all 0.3s ease;
  }
  .ec-navbar .btn-outline-secondary:hover {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #fff;
    transform: rotate(20deg) scale(1.08);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  .ec-navbar input[type="search"] {
    background: var(--nav-input);
    color: var(--nav-text);
    border: 1px solid var(--nav-border);
    border-radius: 999px;
    padding: 0.55rem 1.1rem;
    transition: all 0.25s ease;
  }
  .ec-navbar input[type="search"]::placeholder { color: var(--nav-muted); }
  .ec-navbar input[type="search"]:focus {
    background: var(--nav-card);
    color: var(--nav-text);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
    transform: scale(1.03);
  }

  .ec-navbar .list-group {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--nav-border);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
    margin-top: 8px;
    animation: ecFadeDown 0.2s ease;
  }
  .ec-navbar .list-group-item {
    background: var(--nav-card);
    color: var(--nav-text);
    border: none;
    border-bottom: 1px solid var(--nav-border);
    transition: all 0.15s ease;
  }
  .ec-navbar .list-group-item:last-child { border-bottom: none; }
  .ec-navbar .list-group-item:hover {
    background: var(--nav-hover);
    padding-left: 1.3rem;
  }
  .ec-navbar .list-group-item a {
    color: var(--nav-text);
    font-weight: 500;
    display: block;
  }

  .ec-navbar .bi-cart { transition: transform 0.25s ease; }
  .ec-navbar a:hover .bi-cart {
    transform: translateY(-2px) rotate(-8deg) scale(1.15);
  }

  .ec-navbar .navbar-toggler {
    border: 1px solid var(--nav-border);
    border-radius: 10px;
  }
  .ec-navbar .navbar-toggler:focus {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
    

  @keyframes ecFadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

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
      <style>{navbarStyles}</style>

      <nav className="navbar navbar-expand-lg fixed-top ec-navbar">
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

              {/* Categories Dropdown */}
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
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => handleCategorySelect("")}
                    >
                      All
                    </button>
                  </li>

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
                    className="nav-link dropdown-toggle btn btn-link"
                    type="button"
                    onClick={() => setShowProfile(!showProfile)}
                    aria-expanded={showProfile}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    Profile
                  </button>

                  {showProfile && (
                    <div
                      className="dropdown-menu dropdown-menu-end show p-3 ec-profile-menu"
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