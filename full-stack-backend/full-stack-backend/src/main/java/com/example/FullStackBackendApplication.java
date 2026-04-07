package com.example;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

import com.example.model.Product;
import com.example.model.User;
import com.example.repository.ProductRepository;
import com.example.repository.UserRepository;

@SpringBootApplication
public class FullStackBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullStackBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            Set<String> existingNames = new HashSet<>();
            for (Product product : productRepository.findAll()) {
                if (product.getName() != null) {
                    existingNames.add(product.getName().trim().toLowerCase());
                }
            }

            List<Product> seedProducts = List.of(
                createProduct("Organic Tomatoes", "vegetables", "Fresh organic tomatoes", 45),
                createProduct("Carrots", "vegetables", "Crunchy organic carrots", 35),
                createProduct("Spinach Bundle", "vegetables", "Fresh organic spinach", 25),
                createProduct("Bell Peppers", "vegetables", "Colorful organic peppers", 70),
                createProduct("Organic Apples", "fruits", "Sweet organic apples", 110),
                createProduct("Bananas", "fruits", "Fresh yellow bananas", 45),
                createProduct("Organic Berries Mix", "fruits", "Mixed organic berries", 180),
                createProduct("Oranges", "fruits", "Juicy organic oranges", 70),
                createProduct("Organic Rice", "staples", "1kg organic rice sack", 90),
                createProduct("Whole Wheat Flour", "staples", "1kg organic flour", 55),
                createProduct("Organic Lentils", "staples", "500g organic lentils", 70),
                createProduct("Olive Oil", "staples", "500ml extra virgin olive oil", 320)
            );

            for (Product product : seedProducts) {
                if (!existingNames.contains(product.getName().trim().toLowerCase())) {
                    productRepository.save(product);
                }
            }
        };
    }

    private Product createProduct(String name, String category, String description, double price) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setPrice(price);
        return product;
    }

    @Bean
    CommandLineRunner dropLegacyProductImageColumn(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE products DROP COLUMN IF EXISTS image_url");
            } catch (Exception ignored) {
                // Ignore if column is already removed or database is not ready yet.
            }
        };
    }

    @Bean
    CommandLineRunner seedDefaultAdmin(UserRepository userRepository) {
        return args -> {
            final String adminEmail = "admin@organic.com";
            final String adminPassword = "password123";
            User existingAdmin = userRepository.findByEmail(adminEmail);
            if (existingAdmin == null) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail(adminEmail);
                admin.setRole("ADMIN");
                admin.setPassword(adminPassword);
                userRepository.save(admin);
            } else if (!adminPassword.equals(existingAdmin.getPassword())) {
                existingAdmin.setPassword(adminPassword);
                existingAdmin.setRole("ADMIN");
                existingAdmin.setName("System Admin");
                userRepository.save(existingAdmin);
            }
        };
    }
}