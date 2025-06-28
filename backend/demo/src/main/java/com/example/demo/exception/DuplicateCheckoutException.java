package com.example.demo.exception;

public class DuplicateCheckoutException extends RuntimeException {
    public DuplicateCheckoutException(String message) {
        super(message);
    }
}
