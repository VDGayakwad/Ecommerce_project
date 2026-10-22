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

	@SuppressWarnings("deprecation")
	public Product getProductById(int productId) {

		return repo.getById(productId);
	}

	// public Product updateProduct(int id, Product prod, MultipartFile imageFile)
	// throws IOException {
	// prod.setImageName(imageFile.getOriginalFilename());
	// prod.setImageType(imageFile.getContentType());
	// prod.setImageData(imageFile.getBytes());
	// return repo.save(prod);

	// }

	public Product updateProduct(int id, Product prod, MultipartFile imageFile) throws IOException {

		Product existing = repo.findById(id).orElse(null);
		if (existing == null) {
			return null; // controller returns 404
		}

		// copy the fields that can be updated (adjust to your Product fields)
		existing.setName(prod.getName());
		existing.setDescription(prod.getDescription());
		existing.setPrice(prod.getPrice());
		existing.setCategory(prod.getCategory());
		existing.setReleaseDate(prod.getReleaseDate());
		existing.setAvailability(prod.isAvailability());
		existing.setQuantity(prod.getQuantity());

		// only replace the image if a new one was uploaded
		if (imageFile != null && !imageFile.isEmpty()) {
			existing.setImageName(imageFile.getOriginalFilename());
			existing.setImageType(imageFile.getContentType());
			existing.setImageData(imageFile.getBytes());
		}

		return repo.save(existing);
	}

	public boolean deleteProduct(int id) {

		if (repo.existsById(id)) {
			repo.deleteById(id);
			return true;
		}

		return false;
	}

	public List<Product> searchProducts(String keyword) {
		return repo.searchProducts(keyword);

	}

}
