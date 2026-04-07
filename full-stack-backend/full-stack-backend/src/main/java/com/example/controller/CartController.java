package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import com.example.model.Cart;
import com.example.model.Product;
import com.example.model.User;
import com.example.repository.CartRepository;
import com.example.repository.ProductRepository;
import com.example.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartRepository repo;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartRepository repo, UserRepository userRepository, ProductRepository productRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ADD TO CART
    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        if (cart.getUserId() != null) {
            User user = userRepository.findById(cart.getUserId()).orElse(null);
            if (user != null) {
                cart.setUserName(user.getName());
            }
        }

        if (cart.getProductId() != null) {
            Product product = productRepository.findById(cart.getProductId()).orElse(null);
            if (product != null) {
                cart.setProductName(product.getName());
            }
        }

        return repo.save(cart);
    }

    // GET CART BY USER
    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    // CLEAR CART BY USER
    @DeleteMapping("/user/{userId}")
    public Map<String, Object> clearCart(@PathVariable Long userId) {
        int deleted = repo.clearByUserId(userId);
        return Map.of("deleted", deleted, "message", "Cart cleared");
    }
}