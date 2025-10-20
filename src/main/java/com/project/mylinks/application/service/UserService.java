package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
import com.project.mylinks.application.exception.UserNotFoundExeception;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.entity.UserEntity;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.*;

@Service
public class UserService {

    private final UserRepositoryJpa repository;

    public UserService(UserRepositoryJpa repository) {
        this.repository = repository;
    }

    public UserResponseDTO create(CreateUserDTO dto) {

        User domain = toDomain(dto);

        UserEntity entity = toEntity(domain);

        UserEntity saved = repository.save(entity);
        return toResponse(toModel(saved));
    }

    public Page<UserResponseDTO> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(entity -> toResponse(toModel(entity)));
    }

    public UserResponseDTO findById(UUID id) {
        UserEntity entity = repository.findById(id)
                .orElseThrow(UserNotFoundExeception::new);
        return toResponse(toModel(entity));
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundExeception();
        }
        repository.deleteById(id);
    }


    public UserResponseDTO update(UUID id, UserUpdateDTO dto) {
        UserEntity entity = repository.findById(id)
                .orElseThrow(UserNotFoundExeception::new);

        Optional.ofNullable(dto.username()).ifPresent(entity::setUsername);
        Optional.ofNullable(dto.password()).ifPresent(entity::setPassword);


        UserEntity updated = repository.save(entity);
        return toResponse(toModel(updated));
    }
}
