package com.project.mylinks.infrastructure.persistency.mapper;

import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import lombok.NonNull;


import java.util.List;

public class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(@NonNull CreateUserDTO dto) {

        return User.builder()
                .username(dto.username())
                .email(dto.email())
                .password(dto.password())
                .role(UserRole.USER)
                .build();
    }

    public static UserResponseDTO toResponse(@NonNull User user) {

        List<LinksResponseDTO> linksDTOs = user.getLinks()
                .stream()
                .map(LinksMapper::toResponse)
                .toList();

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                linksDTOs
        );
    }

}
