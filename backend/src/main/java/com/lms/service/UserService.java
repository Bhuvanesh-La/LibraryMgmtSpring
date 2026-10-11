package com.lms.service;

import com.lms.dto.CreatedUserResponse;
import com.lms.dto.UserRequest;
import com.lms.dto.UserResponse;
import com.lms.entity.User;
import com.lms.exception.ApiException;
import com.lms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {

    private static final String ROLE_USER = "USER";
    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findByRoleOrderByUserIdDesc(ROLE_USER).stream().map(UserResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(long id) {
        return UserResponse.from(find(id));
    }

    @Transactional
    public CreatedUserResponse create(UserRequest req) {
        String email = req.email().trim();
        if (userRepository.existsByEmail(email)) {
            throw ApiException.conflict("A user with this email already exists.");
        }

        // Same idea as the original (random 8 char password) - but now it is hashed,
        // and returned once so the admin can actually pass it on.
        String tempPassword = generatePassword(8);

        User user = new User();
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setEmail(email);
        user.setPhoneNo(req.phone().trim());
        user.setAddress(req.address().trim());
        user.setRole(ROLE_USER);
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setCreatedAt(LocalDate.now());

        return new CreatedUserResponse(UserResponse.from(userRepository.save(user)), tempPassword);
    }

    @Transactional
    public UserResponse update(long id, UserRequest req) {
        User user = find(id);
        // Email is read-only in the original edit screen, so it is not changed here.
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setPhoneNo(req.phone().trim());
        user.setAddress(req.address().trim());
        return UserResponse.from(userRepository.save(user));
    }

    private User find(long id) {
        return userRepository.findByUserIdAndRole(id, ROLE_USER)
                .orElseThrow(() -> ApiException.notFound("User not found!!"));
    }

    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(PASSWORD_CHARS.charAt(random.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
