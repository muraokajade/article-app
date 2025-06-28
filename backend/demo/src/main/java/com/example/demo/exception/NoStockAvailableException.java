package com.example.demo.exception;

public class NoStockAvailableException extends RuntimeException {
    public NoStockAvailableException(String message) {
        super(message);
    }
}
