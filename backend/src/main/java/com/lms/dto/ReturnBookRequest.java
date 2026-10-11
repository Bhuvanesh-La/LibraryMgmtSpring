package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReturnBookRequest(
        @NotNull(message = "Please select the return date.") LocalDate returnDate,
        @NotBlank(message = "Please choose the book condition.") String bookCondition,
        String returnNotes) {
}
