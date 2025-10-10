package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
import com.project.mylinks.application.exception.UserNotFoundExeception;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.repository.GenericRepository;
import com.project.mylinks.infrastructure.persistency.mapper.UserMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toDomain;
import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toResponse;

@Service
public class UserService {


    private final GenericRepository<User, UUID> repository;

    public UserService(GenericRepository<User, UUID> repository) {
        this.repository = repository;
    }

    public UserResponseDTO create(CreateUserDTO dto) {
        User domain = toDomain(dto);
        User saved = this.repository.save(domain);
        return toResponse(saved);
    }

    public Page<UserResponseDTO> findAll(Pageable pageable) {
        return this.repository
                .findAll(pageable)
                .map(UserMapper::toResponse);
    }

    public UserResponseDTO findById(UUID id) {
        return this.repository
                .findById(id)
                .map(UserMapper::toResponse)
                .orElseThrow(UserNotFoundExeception::new);
    }

    public void delete(UUID id) {
        this.repository.deleteById(id);
    }

    public UserResponseDTO update(UUID id, UserUpdateDTO dto) {
        User exists = this.repository
                .findById(id)
                .orElseThrow(UserNotFoundExeception::new);

        Optional.ofNullable(dto.username()).ifPresent(exists::setUsername);
        Optional.ofNullable(dto.password()).ifPresent(exists::setPassword);

        User updated = this.repository.save(exists);
        return toResponse(updated);
    }
}
