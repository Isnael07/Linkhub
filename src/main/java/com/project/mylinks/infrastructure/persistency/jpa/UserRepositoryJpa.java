package com.project.mylinks.infrastructure.persistency.jpa;

import com.project.mylinks.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryJpa extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
