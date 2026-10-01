package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.model.Product;
import com.project.service.ProductService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class ProductController {
    @Autowired
    ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {

        return new ResponseEntity<List<Product>>(service.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProd(@PathVariable int id) {
        Product product = service.getProduct(id);
        if (product != null) {
            return new ResponseEntity<Product>(product, HttpStatus.OK);
        } else
            return new ResponseEntity<Product>(HttpStatus.NOT_FOUND);
    }

    // @PostMapping("/products")
    // public void addProd(@RequestBody Product prod) {
    // service.addProduct(prod);
    // }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        try {
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("products/{productId}/image")
    public ResponseEntity<byte[]> getImageById(@PathVariable int productId) {

        Product product = service.getProductById(productId);
        byte[] imagefile = product.getImageData();

        if (product == null || product.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .ok()
                .header("Content-Type", product.getImageType())
                .body(imagefile);
    }

    // UPDATE PRODUCT
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestPart Product product,
            @RequestPart(required = false) MultipartFile imagefile) {

        try {

            Product updatedProduct = service.updateProduct(id, product, imagefile);

            if (updatedProduct != null) {
                return new ResponseEntity<>(
                        updatedProduct,
                        HttpStatus.OK);
            }

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND);

        } catch (Exception e) {

            return new ResponseEntity<>(
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE PRODUCT
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int id) {

        try {

            boolean deleted = service.deleteProduct(id);

            if (deleted) {
                return new ResponseEntity<>(
                        "Product deleted successfully",
                        HttpStatus.OK);
            }

            return new ResponseEntity<>(
                    "Product not found",
                    HttpStatus.NOT_FOUND);

        } catch (Exception e) {

            return new ResponseEntity<>(
                    "Error deleting product",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
