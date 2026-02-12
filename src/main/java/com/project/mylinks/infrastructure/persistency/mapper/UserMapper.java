package com.project.mylinks.infrastructure.persistency.mapper;

import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;


import java.util.List;

public class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(CreateUserDTO dto) {
        if (dto == null) return null;

        return User.builder()
                .username(dto.username())
                .email(dto.email())
                .password(dto.password())
                .role(UserRole.USER)
                .build();
    }

    public static UserResponseDTO toResponse(User user) {
        if (user == null) return null;

        List<LinksResponseDTO> linksDTOs = null;
        if (user.getLinks() != null) {
            linksDTOs = user.getLinks().stream()
                    .map(LinksMapper::toResponse)
                    .toList();
        }

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                linksDTOs
        );
    }

}
