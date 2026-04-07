package com.example.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.example.model.Product;
import com.example.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    // GET ALL
    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // GET BY CATEGORY
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }

    // ADD PRODUCT
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }
}