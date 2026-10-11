package com.lms.repository;

import com.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(String role);

    long countByRole(String role);

    List<User> findByRoleOrderByUserIdDesc(String role);

    Optional<User> findByUserIdAndRole(Long userId, String role);
}
