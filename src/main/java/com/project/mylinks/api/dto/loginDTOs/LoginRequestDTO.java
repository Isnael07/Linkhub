package com.project.mylinks.api.dto.loginDTOs;

import jakarta.validation.constraints.Email;

public record LoginRequestDTO(
        @Email
        String email,
        String password) {
}
