package com.project.mylinks.infrastructure.persistency.impl;

import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.repository.GenericRepository;
import com.project.mylinks.infrastructure.entity.LinksEntity;
import com.project.mylinks.infrastructure.persistency.jpa.LinksRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.mapper.LinksMapper;
import org.springframework.stereotype.Repository;

@Repository
public class LinksRepositoryImpl
        extends GenericRepositoryImpl<Links, LinksEntity, Long>
        implements GenericRepository<Links, Long> {


    public LinksRepositoryImpl(LinksRepositoryJpa repository) {
        super(repository, LinksMapper::toEntity, LinksMapper::toModel);
    }
}
