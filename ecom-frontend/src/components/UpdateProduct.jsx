
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    availability: false,
    quantity: "",
  });

  // Fetch existing product details.
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);

      const data = response.data;

      setUpdateProduct({
        id: data.id,
        name: data.name ?? "",
        brand: data.brand ?? "",
        description: data.description ?? "",
        price: data.price ?? "",
        category: data.category ?? "",
        quantity: data.quantity ?? "",
        releaseDate: data.releaseDate
          ? String(data.releaseDate).substring(0, 10)
          : "",
        availability: Boolean(data.availability),
      });
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error.response?.data || error.message
      );
      alert("Could not load product details.");
    }
  };

  fetchProduct();
}, [id]);

  // Handle text, number, and select changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };

  // Handle availability checkbox.
  const handleAvailabilityChange = (e) => {
    setUpdateProduct((previousProduct) => ({
      ...previousProduct,
      availability: e.target.checked,
    }));
  };

  // Handle newly selected image.
  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  // Submit updated product.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append image only if a new one was selected.
      if (image) {
        formData.append("imageFile", image);
      }

      const productData = {
        ...updateProduct,
        price: Number(updateProduct.price),
        quantity: Number(updateProduct.quantity),
        availability: Boolean(updateProduct.availability),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        })
      );

      console.log("Updating product:", productData);
      console.log("New image:", image);

      // Use the configured API instance so the JWT interceptor runs.
      const response = await API.put(`/products/${id}`, formData);

      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        alert("Access denied. Only an ADMIN can update products.");
      } else {
        alert(
          error.response?.data?.message ||
            error.response?.data ||
            "Failed to update product. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use the new image preview when available.
  const imagePreview = image
    ? URL.createObjectURL(image)
    : null;

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="update-product-container">
      <div
        className="center-container"
        style={{ marginTop: "7rem" }}
      >
        <h1>Update Product</h1>

        <form
          className="row g-3 pt-1"
          onSubmit={handleSubmit}
        >
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={updateProduct.name || ""}
              onChange={handleChange}
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
              value={updateProduct.brand || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={updateProduct.description || ""}
              onChange={handleChange}
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
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              name="category"
              value={updateProduct.category || ""}
              onChange={handleChange}
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
              name="quantity"
              value={updateProduct.quantity}
              onChange={handleChange}
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
              name="releaseDate"
              value={updateProduct.releaseDate || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="New product preview"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  padding: "5px",
                  margin: "0",
                }}
              />
            ) : product.imageName ? (
              <img
                src={`http://localhost:8080/api/products/${id}/image`}
                alt={product.imageName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  padding: "5px",
                  margin: "0",
                }}
              />
            ) : null}

            <input
              className="form-control mt-2"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              name="imageFile"
            />
            <small className="text-muted">
              Choose a new image only if you want to replace the current one.
            </small>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="availability"
                id="gridCheck"
                checked={Boolean(updateProduct.availability)}
                onChange={handleAvailabilityChange}
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
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
