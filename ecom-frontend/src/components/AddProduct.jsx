
import React, { useState } from "react";
import API from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    availability: false,
  });

  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please select a product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("imageFile", image);

      const productData = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        })
      );

      // Use the configured API instance so the JWT interceptor runs.
      const response = await API.post("/products", formData);

      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");

      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        releaseDate: "",
        availability: false,
      });

      setImage(null);

      event.target.reset();
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        alert("Access denied. Only an ADMIN can add products.");
      } else {
        alert(
          error.response?.data?.message ||
            error.response?.data ||
            "Error adding product. Please check the backend logs."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="center-container">
        <form
          className="row g-3 pt-5"
          onSubmit={submitHandler}
        >
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Enter your Brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Add product description"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              placeholder="Enter price"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              required
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Stock remaining"
              onChange={handleInputChange}
              value={product.quantity}
              name="quantity"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>
            <input
              type="date"
              className="form-control"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="availability"
                id="gridCheck"
                checked={product.availability}
                onChange={(e) =>
                  setProduct((previousProduct) => ({
                    ...previousProduct,
                    availability: e.target.checked,
                  }))
                }
              />
              <label
                className="form-check-label"
                htmlFor="gridCheck"
              >
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
