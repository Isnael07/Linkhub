package com.project.mylinks.api.dto.linksDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

public record CreateLinksDTO(
        @NotBlank(message = "O nome de Url é obrigatório.")
        @Size(max = 20, message = "O máximo de caracteres é 20.")
        String nameUrl,
        @NotBlank(message = "A Url é obrigatório.")
        @URL(message = "Url inválida.")
        String url,

        @NotNull(message = "O ID do usuário é obrigatório")
        UUID userId
){}
