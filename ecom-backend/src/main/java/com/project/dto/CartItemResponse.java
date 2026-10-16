
package com.project.dto;

import java.math.BigDecimal;

import com.project.model.CartItem;
import com.project.model.Product;

public class CartItemResponse {

    private Integer cartItemId;
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private boolean availability;
    private int stockQuantity;
    private String imageName;
    private String imageType;
    private int quantity;

    public CartItemResponse(CartItem item) {
        Product product = item.getProduct();

        this.cartItemId = item.getId();
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.category = product.getCategory();
        this.availability = product.isAvailability();
        this.stockQuantity = product.getQuantity();
        this.imageName = product.getImageName();
        this.imageType = product.getImageType();
        this.quantity = item.getQuantity();
    }

    public Integer getCartItemId() {
        return cartItemId;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public boolean isAvailability() {
        return availability;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public String getImageName() {
        return imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public int getQuantity() {
        return quantity;
    }
}
