package com.project.mylinks.api.dto.linksDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LinksUpdateDTO(
        @NotBlank
        @Size(min = 3, max = 20)
        String nameUrl,
        @NotBlank
        String url
){}
