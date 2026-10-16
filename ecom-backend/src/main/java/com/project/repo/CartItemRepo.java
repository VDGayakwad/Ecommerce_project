package com.project.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.model.CartItem;
import com.project.model.User;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct_Id(
            User user,
            Integer productId);

    void deleteByUserAndProduct_Id(User user, Integer productId);

    void deleteByUser(User user);
}
