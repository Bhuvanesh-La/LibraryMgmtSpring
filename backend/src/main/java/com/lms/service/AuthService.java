package com.lms.service;

import com.lms.dto.LoginRequest;
import com.lms.dto.LoginResponse;
import com.lms.entity.User;
import com.lms.exception.ApiException;
import com.lms.repository.UserRepository;
import com.lms.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class AuthService {

    private static final String INVALID = "Invalid username or password";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.username().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, INVALID));

        if (!passwordMatches(user, request.password())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, INVALID);
        }
        if (!"ADMIN".equals(user.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only administrators can sign in.");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new LoginResponse(token, user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());
    }

    /**
     * The original app stored plain-text passwords. If an existing row is still plain text and matches,
     * it is upgraded to a BCrypt hash on the spot, so you can reuse your old database as-is.
     */
    private boolean passwordMatches(User user, String raw) {
        String stored = user.getPassword();
        if (stored == null) {
            return false;
        }
        if (stored.startsWith("$2")) {
            return passwordEncoder.matches(raw, stored);
        }
        boolean legacyMatch = MessageDigest.isEqual(
                stored.getBytes(StandardCharsets.UTF_8), raw.getBytes(StandardCharsets.UTF_8));
        if (legacyMatch) {
            user.setPassword(passwordEncoder.encode(raw));
            userRepository.save(user);
        }
        return legacyMatch;
    }
}
