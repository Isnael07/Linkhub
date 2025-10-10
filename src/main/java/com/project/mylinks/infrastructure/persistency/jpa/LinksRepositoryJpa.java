package com.project.mylinks.infrastructure.persistency.jpa;

import com.project.mylinks.infrastructure.entity.LinksEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LinksRepositoryJpa extends JpaRepository<LinksEntity, Long> {
}
