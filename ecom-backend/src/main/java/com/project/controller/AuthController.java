package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.User;
import com.project.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

   

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
    try {
        userService.registerUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");

    } catch (RuntimeException e) {
        if ("Email already registered".equals(e.getMessage())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Registration failed");
    }
}
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        String result = userService.loginUser(
            user.getEmail(),
            user.getPassword()
        );

        if ("Login successful".equals(result)) {
            return ResponseEntity.ok(result);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}