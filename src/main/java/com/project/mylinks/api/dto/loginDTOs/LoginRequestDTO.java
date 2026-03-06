package com.project.mylinks.api.dto.loginDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @Email(message = "Email invalido")
        @NotBlank
        String email,
        @NotBlank
        String password) {
}
