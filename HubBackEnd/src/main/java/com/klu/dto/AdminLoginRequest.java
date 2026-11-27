package com.klu.dto;

public record AdminLoginRequest(String mail, String password, String authenticatorCode) {}
