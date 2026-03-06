package com.project.mylinks.api.dto.userDTO;

import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
     @Size(min = 3, max = 20, message = "Nome deve ter entre 3 e 20 caracteres.")
     String username,
     @Size(min = 8, max = 16, message = "A senha deve ter no mínimo 6 ou máximo 16 caracteres.")
     String password
){}
