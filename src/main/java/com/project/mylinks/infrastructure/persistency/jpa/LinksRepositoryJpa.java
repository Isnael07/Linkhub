package com.project.mylinks.infrastructure.persistency.jpa;

import com.project.mylinks.domain.model.Links;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LinksRepositoryJpa extends JpaRepository<Links, UUID> {
    List<Links> findByUserUsername(String username);
}
