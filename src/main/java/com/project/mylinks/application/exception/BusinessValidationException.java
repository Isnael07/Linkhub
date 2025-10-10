package com.project.mylinks.application.exception;

public class BusinessValidationException extends RuntimeException{
    public BusinessValidationException(String message) {
        super(message);
    }
}
