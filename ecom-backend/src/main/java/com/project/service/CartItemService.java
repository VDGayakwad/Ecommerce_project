package com.project.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.project.model.CartItem;
import com.project.model.Product;
import com.project.model.User;
import com.project.repo.CartItemRepo;
import com.project.repo.ProductRepo;
import com.project.repo.UserRepo;

@Service
public class CartItemService {

    private final CartItemRepo cartItemRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    public CartItemService(
            CartItemRepo cartItemRepo,
            UserRepo userRepo,
            ProductRepo productRepo) {
        this.cartItemRepo = cartItemRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    private User getUser(String email) {
        User user = userRepo.findByEmail(email);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User account not found");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCart(String email) {
        User user = getUser(email);
        return cartItemRepo.findByUser(user);
    }

    @Transactional
    public CartItem addToCart(String email, Integer productId) {
        User user = getUser(email);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.isAvailability() || product.getQuantity() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Product is out of stock");
        }

        CartItem item = cartItemRepo
                .findByUserAndProduct_Id(user, productId)
                .orElse(null);

        if (item == null) {
            item = new CartItem(user, product, 1);
        } else {
            if (item.getQuantity() >= product.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Cannot add more than available stock");
            }

            item.setQuantity(item.getQuantity() + 1);
        }

        return cartItemRepo.save(item);
    }

    @Transactional
    public void removeFromCart(String email, Integer productId) {
        User user = getUser(email);

        cartItemRepo.deleteByUserAndProduct_Id(user, productId);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        cartItemRepo.deleteByUser(user);
    }
}
