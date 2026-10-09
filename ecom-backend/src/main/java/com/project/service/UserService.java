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

          // Check whether email already exists
    if (userRepository.findByEmail(user1.getEmail()) != null) {
        throw new RuntimeException("Email already registered");
    }
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


}