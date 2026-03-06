package com.project.mylinks.api.dto.linksDTO;

import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record LinksUpdateDTO(
        @Size(max = 20, message = "O máximo de caracteres é 20.")
        String nameUrl,
        @URL(message = "Url inválida.")
        String url
){}
