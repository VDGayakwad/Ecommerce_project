package com.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.model.User;
import com.project.repo.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user1) {

        if (user1.getEmail() == null || user1.getEmail().isBlank()
                || user1.getPassword() == null
                || user1.getPassword().isBlank()) {
            throw new RuntimeException("Email and password are required");
        }

        if (userRepository.findByEmail(user1.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        // Never accept ADMIN role from public registration
        user1.setRole("USER");

        String encodedPassword = passwordEncoder.encode(user1.getPassword());

        user1.setPassword(encodedPassword);

        return userRepository.save(user1);
    }

    public String loginUser(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return "User not found";
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            return "Login successful";
        }

        return "Invalid password";
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findOrCreateGoogleUser(String email, String name) {

        User user = userRepository.findByEmail(email);

        if (user != null) {
            // Preserve the role of an existing account.
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
                user = userRepository.save(user);
            }

            return user;
        }

        // New Google users are always regular users.
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(
                name == null || name.isBlank() ? email : name);
        newUser.setRole("USER");

        // Google authentication does not require a local password.
        return userRepository.save(newUser);
    }

}