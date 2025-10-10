package com.project.mylinks.infrastructure.persistency.mapper;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.entity.LinksEntity;
import com.project.mylinks.infrastructure.entity.UserEntity;

public final class LinksMapper {

    private LinksMapper() {}

    public static LinksEntity toEntity(Links model) {
        if (model == null) return null;

        UserEntity userEntity = null;
        if (model.getUser() != null) {
            userEntity = UserEntity.builder()
                    .id(model.getUser().getId())
                    .username(model.getUser().getUsername())
                    .password(model.getUser().getPassword())
                    .email(model.getUser().getEmail())
                    .build();
        }

        return LinksEntity.builder()
                .id(model.getId())
                .nameUrl(model.getNameUrl())
                .url(model.getUrl())
                .user(userEntity)
                .build();
    }

    public static Links toModel(LinksEntity entity) {
        if (entity == null) return null;

        User user = null;
        if (entity.getUser() != null) {
            user = new User(
                    entity.getUser().getId(),
                    entity.getUser().getUsername(),
                    entity.getUser().getPassword(),
                    entity.getUser().getEmail()
            );
        }

        return new Links(
                entity.getId(),
                entity.getNameUrl(),
                entity.getUrl(),
                user
        );
    }

    public static Links toDomain(CreateLinksDTO dto) {
        if (dto == null) return null;
        return new Links(
                dto.nameUrl(),
                dto.url()
        );
    }

    public static LinksResponseDTO toResponse(Links model) {
        if (model == null) return null;
        return new LinksResponseDTO(
                model.getId(),
                model.getNameUrl(),
                model.getUrl()
        );
    }
}
