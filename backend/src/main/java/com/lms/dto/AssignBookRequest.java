package com.lms.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AssignBookRequest(
        @NotNull(message = "Please choose a book to assign.") Long bookId,
        @NotNull(message = "Please choose a member.") Long userId,
        @NotNull(message = "Please select the due date.") LocalDate dueDate,
        String assignmentNotes) {
}
