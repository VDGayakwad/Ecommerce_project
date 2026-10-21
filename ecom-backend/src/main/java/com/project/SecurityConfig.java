
package com.project;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.project.security.JwtAuthenticationFilter;
import com.project.security.OAuth2LoginSuccessHandler;

@Configuration
public class SecurityConfig {

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        OAuth2LoginSuccessHandler oauth2LoginSuccessHandler)
                        throws Exception {

                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

                                .authorizeHttpRequests(auth -> auth

                                                // Allow CORS preflight requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // Google OAuth endpoints
                                                .requestMatchers(
                                                                "/oauth2/**",
                                                                "/login/oauth2/**")
                                                .permitAll()

                                                // Login and registration
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // only admin can access the testcontroller
                                                .requestMatchers("/api/test/**")
                                                .hasRole("ADMIN")

                                                // Only ADMIN can create products
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/products",
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Only ADMIN can update products
                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/products",
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Only ADMIN can delete products
                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/products",
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Only ADMIN can use PATCH product endpoints
                                                .requestMatchers(
                                                                HttpMethod.PATCH,
                                                                "/api/products",
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Product browsing, searching and image retrieval are public
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/products",
                                                                "/api/products/**")
                                                .permitAll()

                                                // Cart and all other endpoints require authentication
                                                .anyRequest().authenticated())

                                .oauth2Login(oauth2 -> oauth2.successHandler(oauth2LoginSuccessHandler))

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of("http://localhost:5173"));

                configuration.setAllowedMethods(
                                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of("Authorization", "Content-Type", "Accept", "Origin"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
