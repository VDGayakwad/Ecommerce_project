package com.project.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import java.util.stream.Collectors;
import com.project.dto.CartItemResponse;


import com.project.service.CartItemService;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping
    public List<CartItemResponse> getCart(Principal principal) {
        return cartItemService.getCart(getEmail(principal))
                .stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/{productId}")
    public CartItemResponse addToCart(
            @PathVariable Integer productId,
            Principal principal) {

        return new CartItemResponse(
                cartItemService.addToCart(
                        getEmail(principal), productId));
    }

    @DeleteMapping("/{productId}")
    public void removeFromCart(
            @PathVariable Integer productId,
            Principal principal) {
        cartItemService.removeFromCart(
                getEmail(principal), productId);
    }

    @DeleteMapping
    public void clearCart(Principal principal) {
        cartItemService.clearCart(getEmail(principal));
    }

    private String getEmail(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in");
        }

        return principal.getName();
    }
}
