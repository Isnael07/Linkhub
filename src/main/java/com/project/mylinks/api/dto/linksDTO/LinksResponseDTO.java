package com.project.mylinks.api.dto.linksDTO;

import java.util.UUID;

public record LinksResponseDTO(
        UUID id,
        String nameUrl,
        String url
){}
