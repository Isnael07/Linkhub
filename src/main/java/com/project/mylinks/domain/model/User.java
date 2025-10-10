package com.project.mylinks.domain.model;

import java.util.List;
import java.util.UUID;

public class User {

    private UUID id;
    private String username;
    private String password;
    private String email;
    private List<Links> links; // 👈 relação 1:N (um usuário tem vários links)

    public User(UUID id, String username, String password, String email, List<Links> links) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.links = links;
    }

    public User(String username, String password, String email, List<Links> links) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.links = links;
    }

    public User(UUID id, String username, String password, String email) {
        this(id, username, password, email, null);
    }

    public User(String username, String password, String email) {
        this(null, username, password, email, null);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Links> getLinks() {
        return links;
    }

    public void setLinks(List<Links> links) {
        this.links = links;
    }
}
