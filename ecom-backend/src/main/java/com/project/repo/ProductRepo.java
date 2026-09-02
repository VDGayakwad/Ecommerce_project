package com.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.model.Product;

public interface ProductRepo extends JpaRepository<Product, Integer>{

}
