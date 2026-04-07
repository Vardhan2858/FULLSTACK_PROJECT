package com.example.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);
}