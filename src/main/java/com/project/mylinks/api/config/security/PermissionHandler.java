package com.project.mylinks.api.config.security;

import com.project.mylinks.application.service.AuthorizationService;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("permissionHandler")
public class PermissionHandler {

    private final AuthorizationService authorizationService;

    public PermissionHandler(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    public boolean canDeleteLink(UUID id) {
        return authorizationService.canDeleteLink(id);
    }

    public boolean canEditLink(UUID id) {
        return authorizationService.canEditLink(id);
    }

    public boolean canViewLink(UUID id) {
        return authorizationService.canViewLink(id);
    }

    public boolean canViewUser(UUID id){
        return false;
    }

    public boolean canDeleteUser(UUID id){
        return false;
    }

    public boolean canEditUser(UUID id){
        return false;
    }
}

