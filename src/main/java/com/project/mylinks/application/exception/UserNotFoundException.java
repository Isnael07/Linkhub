package com.project.mylinks.application.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("User não encontrado");
    }
}
