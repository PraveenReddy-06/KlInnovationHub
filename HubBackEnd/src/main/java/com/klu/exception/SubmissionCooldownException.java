package com.klu.exception;

public class SubmissionCooldownException extends RuntimeException {

    public SubmissionCooldownException(String message) {
        super(message);
    }
}