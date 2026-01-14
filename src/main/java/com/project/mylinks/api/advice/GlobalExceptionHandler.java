package com.project.mylinks.api.advice;


import com.project.mylinks.application.exception.BusinessValidationException;
import com.project.mylinks.application.exception.LinksNotFoundException;
import com.project.mylinks.application.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<Object> handlerLinksNotFound(LinksNotFoundException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<Object> handleBusinessValidation(BusinessValidationException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    private ResponseEntity<Object> buildErrorResponse(String mensagem, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put(ErrorResponseAttributes.MENSAGEM, mensagem);
        body.put(ErrorResponseAttributes.STATUS, status.value());
        body.put(ErrorResponseAttributes.TIMESTAMP, LocalDateTime.now());
        return ResponseEntity.status(status).body(body);
    }

}
