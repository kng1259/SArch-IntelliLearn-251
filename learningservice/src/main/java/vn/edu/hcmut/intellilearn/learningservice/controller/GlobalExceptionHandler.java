package vn.edu.hcmut.intellilearn.learningservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import vn.edu.hcmut.intellilearn.learningservice.controller.datatype.ApiError;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAllExceptions(
            Exception ex,
            WebRequest request) {

        ApiError error = ApiError.of(
                ex.getMessage(),
                "INTERNAL_SERVER_ERROR"
        );
        log.error(ex.getMessage(), ex);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex,
            WebRequest request) {

        ApiError error = ApiError.of(
                ex.getMessage(),
                "BAD_REQUEST"
        );
        log.warn(ex.getMessage(), ex);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
