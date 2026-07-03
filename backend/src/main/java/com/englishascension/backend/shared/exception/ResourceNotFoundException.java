package com.englishascension.backend.shared.exception;

/**
 * Thrown when a requested resource is not found.
 * Handled globally by {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with id: " + id);
    }

    public ResourceNotFoundException(String resourceName, String id) {
        super(resourceName + " not found with id: " + id);
    }
}
