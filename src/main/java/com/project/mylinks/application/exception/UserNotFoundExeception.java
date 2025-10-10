package com.project.mylinks.application.exception;

public class UserNotFoundExeception extends RuntimeException {
    public UserNotFoundExeception() {
        super("User não encontrado");
    }
}
