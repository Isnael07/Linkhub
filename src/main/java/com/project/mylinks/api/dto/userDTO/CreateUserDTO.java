package com.project.mylinks.api.dto.userDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank(message = "O username é obrigatório")
        @Size(min = 3, max = 20, message = "Nome deve ter entre 3 e 20 caracteres")
        String username,
        @Email
        @NotBlank
        String email,
        @NotBlank
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        String password
) {}
