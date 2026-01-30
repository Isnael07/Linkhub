package com.project.mylinks.application.exception;


public class EmailAlreadyUseException extends RuntimeException {
    public EmailAlreadyUseException() {
        super("Email já em uso");
    }
}
