package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
import com.project.mylinks.application.exception.UserNotFoundException;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.mapper.UserMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toEntity;
import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toResponse;

@Service
@Transactional
public class UserService {

    private final UserRepositoryJpa repository;


    public UserService(UserRepositoryJpa repository) {
        this.repository = repository;

    }

    public UserResponseDTO create(CreateUserDTO dto) {
        User user = toEntity(dto);
        repository.save(user);
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(UserMapper::toResponse);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "users",  key = "#id")
    public UserResponseDTO findById(UUID id) {
        User user = repository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        return toResponse(user);
    }

    @CacheEvict(cacheNames = "users", key = "#id")
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @CachePut(cacheNames = "users", key = "#id")
    public UserResponseDTO update(UUID id, UserUpdateDTO dto) {
        User user = repository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        if (dto.username() != null) user.setUsername(dto.username());
        if (dto.password() != null) user.setPassword(dto.password());

        repository.save(user);
        return toResponse(user);
    }
}
