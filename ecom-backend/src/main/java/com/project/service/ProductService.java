package com.project.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.model.Product;
import com.project.repo.ProductRepo;

@Service
public class ProductService {

	@Autowired
	private ProductRepo repo;

	public List<Product> getAllProducts() {

		return repo.findAll();
	}

	public Product getProduct(int id) {
		return repo.findById(id).orElse(null);
	}

	public Product addProduct(Product prod, MultipartFile imageFile) throws IOException {
		prod.setImageName(imageFile.getOriginalFilename());
		prod.setImageType(imageFile.getContentType());
		prod.setImageData(imageFile.getBytes());
		return repo.save(prod);

	}

	public Product getProductById(int productId) {

		return repo.getById(productId);
	}

	public Product updateProduct(int id, Product prod, MultipartFile imageFile) throws IOException {
		prod.setImageName(imageFile.getOriginalFilename());
		prod.setImageType(imageFile.getContentType());
		prod.setImageData(imageFile.getBytes());
		return repo.save(prod);

	}

	public boolean deleteProduct(int id) {

		if (repo.existsById(id)) {
			repo.deleteById(id);
			return true;
		}

		return false;
	}

}
