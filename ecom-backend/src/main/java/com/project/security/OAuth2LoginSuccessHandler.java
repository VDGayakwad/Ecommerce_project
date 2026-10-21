
package com.project.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.project.model.User;
import com.project.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler
                implements AuthenticationSuccessHandler {

        private final JWTService jwtService;
        private final UserService userService;

        public OAuth2LoginSuccessHandler(
                        JWTService jwtService,
                        UserService userService) {
                this.jwtService = jwtService;
                this.userService = userService;
        }

        @Override
        public void onAuthenticationSuccess(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication)
                        throws IOException, ServletException {

                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

                String email = oauth2User.getAttribute("email");
                String name = oauth2User.getAttribute("name");

                if (email == null || email.isBlank()) {
                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Google account email not available");
                        return;
                }

                // Get the role from our own database.
                User user = userService.findOrCreateGoogleUser(email, name);

                String token = jwtService.generateToken(
                                user.getEmail(),
                                user.getRole());

                response.sendRedirect(
                                "http://localhost:5173/oauth2/callback#token=" + token);
        }
}
