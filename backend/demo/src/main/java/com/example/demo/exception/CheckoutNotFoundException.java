package com.example.demo.exception;

public class CheckoutNotFoundException extends RuntimeException {
    public CheckoutNotFoundException(String message) {
        super(message);
    }
}
