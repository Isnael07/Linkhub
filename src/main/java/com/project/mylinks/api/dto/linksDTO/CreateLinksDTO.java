package com.project.mylinks.api.dto.linksDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateLinksDTO(
        @NotBlank
        @Size(min = 3, max = 20)
        String nameUrl,
        @NotBlank
        String url,

        @NotNull(message = "O ID do usuário é obrigatório")
        UUID userId
){}
