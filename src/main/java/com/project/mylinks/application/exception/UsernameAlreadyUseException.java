package com.project.mylinks.application.exception;

public class UsernameAlreadyUseException extends RuntimeException {
    public UsernameAlreadyUseException() {
        super("Username já em uso");
    }
}
