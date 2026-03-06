package com.project.mylinks.api.dto.userDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank(message = "O username é obrigatório.")
        @Size(min = 3, max = 20, message = "Nome deve ter entre 3 e 20 caracteres.")
        String username,
        @Email(message = "Email inválido.")
        @NotBlank(message = "Email é obrigatório.")
        String email,
        @NotBlank
        @Size(min = 8, max = 16, message = "A senha deve ter no mínimo 6 ou máximo 16 caracteres.")
        String password
) {}
