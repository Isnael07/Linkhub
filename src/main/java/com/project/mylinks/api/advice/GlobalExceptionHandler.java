package com.project.mylinks.api.advice;


import com.project.mylinks.application.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
    @ExceptionHandler(UsernameAlreadyUseException.class)
    public ResponseEntity<Object> handleUsernameAlreadyUseException(UsernameAlreadyUseException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }
    @ExceptionHandler(EmailAlreadyUseException.class)
    public ResponseEntity<Object> handleEmailAlreadyUsed(EmailAlreadyUseException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }
    @ExceptionHandler
    public ResponseEntity<Object> handlerLinksNotFound(LinksNotFoundException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<Object> handleBusinessValidation(BusinessValidationException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex){
        return buildErrorResponse(ex.getBindingResult().toString(), HttpStatus.BAD_REQUEST);
    }
    private ResponseEntity<Object> buildErrorResponse(String mensagem, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put(ErrorResponseAttributes.MENSAGEM, mensagem);
        body.put(ErrorResponseAttributes.STATUS, status.value());
        body.put(ErrorResponseAttributes.TIMESTAMP, LocalDateTime.now());
        return ResponseEntity.status(status).body(body);
    }

}
