package com.project.mylinks.domain.model;

public class Links {

    private long id;
    private String nameUrl;
    private String url;
    private User user;

    public Links(long id, String nameUrl, String url, User user) {
        this.id = id;
        this.nameUrl = nameUrl;
        this.url = url;
        this.user = user;
    }

    public Links(String nameUrl, String url, User user) {
        this.nameUrl = nameUrl;
        this.url = url;
        this.user = user;
    }

    public Links(long id, String nameUrl, String url) {
        this(id, nameUrl, url, null);
    }

    public Links(String nameUrl, String url) {
        this(0, nameUrl, url, null);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNameUrl() {
        return nameUrl;
    }

    public void setNameUrl(String nameUrl) {
        this.nameUrl = nameUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
