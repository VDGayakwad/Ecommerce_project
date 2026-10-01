
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  // Fetch images for all products
  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/products/${product.id}/image`,
                {
                  responseType: "blob",
                }
              );

              const imageUrl = URL.createObjectURL(response.data);

              return {
                ...product,
                imageUrl,
              };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );

              return {
                ...product,
                imageUrl: "",
              };
            }
          })
        );

        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    } else {
      setProducts([]);
    }
  }, [data]);

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category === selectedCategory
      )
    : products;

  // Error UI
  if (isError) {
    return (
      <h2
        className="text-center"
        style={{ padding: "18rem" }}
      >
        <img
          src={unplugged}
          alt="Error"
          style={{
            width: "100px",
            height: "100px",
          }}
        />
      </h2>
    );
  }

  return (
    <>
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const {
              id,
              name,
              description,
              price,
              availability,
              quantity,
              imageUrl,
            } = product;

            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "360px",
                  boxShadow:
                    "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: availability
                    ? "#fff"
                    : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                }}
                key={id}
              >
                {/* Product details */}
                <Link
                  to={`/product/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    flexGrow: 1,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      padding: "5px",
                      borderRadius: "10px",
                    }}
                  />

                  <div
                    className="card-body"
                    style={{
                      padding: "10px",
                    }}
                  >
                    <h5
                      className="card-title"
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "1.2rem",
                      }}
                    >
                      {name
                        ? name.toUpperCase()
                        : ""}
                    </h5>

                    <p
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "0.85rem",
                        color: "#555",
                      }}
                    >
                      {description}
                    </p>

                    <hr
                      className="hr-line"
                      style={{
                        margin: "10px 0",
                      }}
                    />

                    <h5
                      className="card-text"
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        marginBottom: "5px",
                      }}
                    >
                      <i className="bi bi-currency-rupee"></i>{" "}
                      {price}
                    </h5>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        margin: "0",
                      }}
                    >
                      Stock: {quantity}
                    </p>
                  </div>
                </Link>

                {/* Add to Cart button */}
                <button
                  className="btn-hover color-9"
                  style={{
                    margin: "5px 25px 10px",
                  }}
                  onClick={() => {
                    addToCart(product);
                    alert("Product added to cart");
                  }}
                  disabled={!availability}
                >
                  {availability
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
