package com.example.demo.exception;

public class AlreadyCheckedOutException extends RuntimeException {
    public AlreadyCheckedOutException(String message) {
        super(message);
    }
}
