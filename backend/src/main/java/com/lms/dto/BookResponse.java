package com.lms.dto;

import com.lms.entity.Book;

import java.time.LocalDate;

public record BookResponse(Long bookId, String title, String author, String category, String isbn,
                           String publisher, int totalCopies, int availableCopies, LocalDate createdAt,
                           String status) {

    public static BookResponse from(Book b) {
        return new BookResponse(b.getBookId(), b.getTitle(), b.getAuthor(), b.getCategory(), b.getIsbn(),
                b.getPublisher(), b.getTotalCopies(), b.getAvailableCopies(), b.getCreatedAt(), b.getStatus());
    }
}
