package com.project.mylinks.application.service;

import com.project.mylinks.api.config.security.AuthUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthorizationService {

    private final LinksService linksService;

    public AuthorizationService(LinksService linksService) {
        this.linksService = linksService;
    }

    public boolean canDeleteLink(UUID linkId) {
        return canPermission(linkId);
    }

    public boolean canEditLink(UUID linkId) {
        return canPermission(linkId);
    }

    public boolean canViewLink(UUID linkId) {
        return canPermission(linkId);
    }


    public boolean canPermission(UUID linkId){
        UUID userId = AuthUtil.getAuthenticatedUserId();
        UUID ownerId = linksService.findOwnerId(linkId);

        if (ownerId == null) return false;
        if (ownerId.equals(userId)) return true;

        return AuthUtil.hasRole("ADMIN");
    }
}
