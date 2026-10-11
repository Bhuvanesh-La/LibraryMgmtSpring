package com.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * Used for both create and update.
 * availableCopies is only used on create (ignored on update, where it is derived).
 */
public record BookRequest(
        @NotBlank(message = "Please enter the book title.") String title,
        @NotBlank(message = "Please enter the author name.") String author,
        @NotBlank(message = "Please enter the ISBN number.") String isbn,
        @NotBlank(message = "Please choose a category.") String category,
        @NotBlank(message = "Please enter the publisher name.") String publisher,
        @Min(value = 1, message = "Number of copies must be at least 1.") int totalCopies,
        Integer availableCopies) {
}
