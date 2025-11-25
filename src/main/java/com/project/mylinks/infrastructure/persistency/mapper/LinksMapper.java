package com.project.mylinks.infrastructure.persistency.mapper;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;

public class LinksMapper {

    private LinksMapper() {
    }

    public static Links toEntity(CreateLinksDTO dto, User user) {
        if (dto == null) return null;

        return Links.builder()
                .nameUrl(dto.nameUrl())
                .url(dto.url())
                .user(user)
                .build();
    }

    public static LinksResponseDTO toResponse(Links link) {
        if (link == null) return null;

        return new LinksResponseDTO(
                link.getId(),
                link.getNameUrl(),
                link.getUrl()
        );
    }
}
