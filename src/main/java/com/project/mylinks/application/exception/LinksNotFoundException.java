package com.project.mylinks.application.exception;

public class LinksNotFoundException extends RuntimeException {
    public LinksNotFoundException() {
        super("Link não encontrado");
    }
}
