package com.project.mylinks.infrastructure.persistency.jpa;

import com.project.mylinks.domain.model.Links;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LinksRepositoryJpa extends JpaRepository<Links, UUID> {
}
