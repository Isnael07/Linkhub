package com.project.mylinks.api.advice;


import com.project.mylinks.application.exception.BusinessValidationException;
import com.project.mylinks.application.exception.UserNotFoundExeception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundExeception.class)
    public ResponseEntity<Object> handleEntidadeNaoEncontrada(UserNotFoundExeception ex) {
        return buildErrorResponse(ex.getMessage(), null, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<Object> handleValidacaoNegocio(BusinessValidationException ex) {
        return buildErrorResponse(ex.getMessage(), null, HttpStatus.BAD_REQUEST);
    }
    private ResponseEntity<Object> buildErrorResponse(String mensagem, Object detalhes, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put(ErrorResponseAttributes.MENSAGEM, mensagem);
        if (detalhes != null) {
            body.put(ErrorResponseAttributes.DETALHES, detalhes);
        }
        body.put(ErrorResponseAttributes.STATUS, status.value());
        body.put(ErrorResponseAttributes.TIMESTAMP, LocalDateTime.now());
        return ResponseEntity.status(status).body(body);
    }

}
