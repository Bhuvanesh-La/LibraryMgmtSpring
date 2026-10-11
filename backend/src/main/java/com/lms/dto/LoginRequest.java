package com.lms.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Please enter username") String username,
        @NotBlank(message = "Please enter password") String password) {
}
