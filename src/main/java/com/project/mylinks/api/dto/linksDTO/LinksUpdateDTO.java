package com.project.mylinks.api.dto.linksDTO;

import jakarta.validation.constraints.Size;

public record LinksUpdateDTO(
        @Size(max = 20)
        String nameUrl,
        String url
){}
