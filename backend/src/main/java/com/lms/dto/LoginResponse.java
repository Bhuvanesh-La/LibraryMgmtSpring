package com.lms.dto;

public record LoginResponse(String token, String firstName, String lastName, String email, String role) {
}
