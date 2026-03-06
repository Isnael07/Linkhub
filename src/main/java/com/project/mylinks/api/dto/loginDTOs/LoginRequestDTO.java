package com.project.mylinks.api.dto.loginDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @Email(message = "Email inválido.")
        @NotBlank(message = "Email é obrigatório.")
        String email,
        @NotBlank(message = "senha é obrigatório.")
        String password) {
}
