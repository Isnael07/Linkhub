package com.project.mylinks.api.dto.userDTO;

import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;

import java.util.List;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email,
        List<LinksResponseDTO> links,
        String refreshToken
){}
