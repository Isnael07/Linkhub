package com.project.mylinks.infrastructure.persistency.jpa;

import com.project.mylinks.infrastructure.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepositoryJpa extends JpaRepository<UserEntity, UUID> {
}
