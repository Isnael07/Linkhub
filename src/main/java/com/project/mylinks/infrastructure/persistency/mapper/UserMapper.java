package com.project.mylinks.infrastructure.persistency.mapper;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.entity.UserEntity;

import java.util.List;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {}

    public static UserEntity toEntity(User model) {
        if (model == null) return null;

        UserEntity entity = UserEntity.builder()
                .id(model.getId())
                .username(model.getUsername())
                .email(model.getEmail())
                .password(model.getPassword())
                .build();

        if (model.getLinks() != null) {
            entity.setLinks(
                    model.getLinks().stream()
                            .map(LinksMapper::toEntity)
                            .collect(Collectors.toList())
            );
        }

        return entity;
    }

    public static User toModel(UserEntity entity) {
        if (entity == null) return null;

        List<Links> links = null;
        if (entity.getLinks() != null) {
            links = entity.getLinks().stream()
                    .map(LinksMapper::toModel)
                    .collect(Collectors.toList());
        }

        return new User(
                entity.getId(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getEmail(),
                links
        );
    }

    public static User toDomain(CreateUserDTO dto) {
        if (dto == null) return null;
        return new User(
                dto.username(),
                dto.password(),
                dto.email()
        );
    }

    public static UserResponseDTO toResponse(User model) {
        if (model == null) return null;
        return new UserResponseDTO(
                model.getId(),
                model.getUsername(),
                model.getEmail()
        );
    }
}
