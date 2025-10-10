package com.project.mylinks.api.dto.userDTO;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email
){}
