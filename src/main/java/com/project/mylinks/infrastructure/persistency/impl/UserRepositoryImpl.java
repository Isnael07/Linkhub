package com.project.mylinks.infrastructure.persistency.impl;

import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.repository.GenericRepository;
import com.project.mylinks.infrastructure.entity.UserEntity;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.mapper.UserMapper;

import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public class UserRepositoryImpl
        extends GenericRepositoryImpl<User, UserEntity, UUID>
        implements GenericRepository<User, UUID> {

    public UserRepositoryImpl(UserRepositoryJpa repository) {
        super(repository, UserMapper::toEntity, UserMapper::toModel);
    }
}
