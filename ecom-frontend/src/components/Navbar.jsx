import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Restore login state from the saved JWT
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  // Update login state after login, Google callback, navigation or logout
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);

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
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);

    if (value.length >= 1) {
      setShowSearchResults(true);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(value)}`
        );

        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
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

  // Logout: clear the JWT from the browser
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
    <>
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
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/add_product">
                    Add Product
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(event) => event.preventDefault()}
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>

                {!isLoggedIn ? (
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
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link btn btn-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>

              <button
                className="theme-btn"
                onClick={toggleTheme}
                type="button"
              >
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              <div className="d-flex align-items-center cart">
                <Link to="/cart" className="nav-link text-dark">
                  <i
                    className="bi bi-cart me-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Cart
                  </i>
                </Link>

                <div className="position-relative">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={input}
                    onChange={(event) =>
                      handleChange(event.target.value)
                    }
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />

                  {showSearchResults && (
                    <ul className="list-group position-absolute w-100">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <li
                            key={result.id}
                            className="list-group-item"
                          >
                            <Link
                              to={`/product/${result.id}`}
                              className="search-result-link"
                              onClick={() =>
                                setShowSearchResults(false)
                              }
                            >
                              <span>{result.name}</span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        noResults && (
                          <li className="list-group-item">
                            No Product with such Name
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;