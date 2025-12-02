package vn.edu.hcmut.intellilearn.teachingservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiError;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAllExceptions(
            Exception ex,
            WebRequest request) {

        ApiError error = ApiError.of(
                "An unexpected error occurred. Please try again later.",
                "INTERNAL_SERVER_ERROR"
        );
        log.error("Unexpected error: {}", ex.getMessage(), ex);
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
        log.warn("Illegal argument: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            WebRequest request) {
        
        String message = "Data validation failed.";
        String rootCauseMessage = ex.getMostSpecificCause().getMessage();
        
        // Parse common constraint violations
        if (rootCauseMessage != null) {
            if (rootCauseMessage.contains("check_assignment_dates") || 
                rootCauseMessage.contains("check_test_dates")) {
                message = "Start date must be before end date.";
            } else if (rootCauseMessage.contains("unique") || rootCauseMessage.contains("duplicate")) {
                message = "A record with this information already exists.";
            } else if (rootCauseMessage.contains("foreign key") || rootCauseMessage.contains("fk_")) {
                message = "Referenced record does not exist.";
            } else if (rootCauseMessage.contains("not-null") || rootCauseMessage.contains("null value")) {
                message = "Required field is missing.";
            }
        }
        
        ApiError error = ApiError.of(message, "BAD_REQUEST");
        log.warn("Data integrity violation: {}", rootCauseMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();

        // Tên trường (field) + Thông báo lỗi (message)
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiError error = ApiError.of(
                errors.toString(),
                "BAD_REQUEST"
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
