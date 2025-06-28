package com.example.demo.exception;

public class OverdueLoanException extends RuntimeException {
    public OverdueLoanException(String message) {
        super(message);
    }
}
