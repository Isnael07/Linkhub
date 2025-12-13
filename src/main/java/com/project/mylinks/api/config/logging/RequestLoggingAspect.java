package com.project.mylinks.api.config.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.UUID;

@Slf4j
@Aspect
@Component
public class RequestLoggingAspect {

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {}

    @Around("controllerMethods()")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {

        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attr != null ? attr.getRequest() : null;
        HttpServletResponse response = attr != null ? attr.getResponse() : null;


        String correlationId = UUID.randomUUID().toString();

        long start = System.currentTimeMillis();


        Object result = joinPoint.proceed();

        long time = System.currentTimeMillis() - start;


        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();


        String httpMethod = request != null ? request.getMethod() : "?";
        String path = request != null ? request.getRequestURI() : "?";
        String clientIp = request != null ? request.getRemoteAddr() : "?";

        String user = "anonymous";

        if (attr != null && attr.getRequest().getUserPrincipal() != null) {
            user = attr.getRequest().getUserPrincipal().getName();
        }

        int status = response != null ? response.getStatus() : -1;

        log.info(
                "[REQUEST] [{}] {} {} | Controller: {}.{} | IP: {} | User: {} | Status: {} | Tempo: {} ms",
                correlationId,
                httpMethod,
                path,
                className,
                methodName,
                clientIp,
                user,
                status,
                time
        );

        return result;
    }
}
