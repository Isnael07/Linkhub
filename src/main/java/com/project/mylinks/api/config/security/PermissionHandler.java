package com.project.mylinks.api.config.security;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.application.service.LinksService;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("permissionHandler")
public class PermissionHandler {

    private static final String ADMIN = "ADMIN";


    private final LinksService linksService;

    public PermissionHandler(LinksService linksService) {
        this.linksService = linksService;
    }


    public boolean canPermissionLinks(UUID linkId){
        UUID userId = AuthUtil.getAuthenticatedUserId();
        UUID ownerId = linksService.findOwnerId(linkId);

        if (ownerId == null) return false;
        if (ownerId.equals(userId)) return true;

        return AuthUtil.hasRole(ADMIN);

    }

    public boolean canPermissionLinksByUserId(CreateLinksDTO dto){
        UUID user = AuthUtil.getAuthenticatedUserId();
        return user.equals(dto.userId()) || AuthUtil.hasRole(ADMIN);
    }

    public boolean canPermissionUser(UUID userId){
        UUID id =  AuthUtil.getAuthenticatedUserId();
        if(id.equals(userId)) return true;

        return AuthUtil.hasRole(ADMIN);
    }
}

