package com.lms.dto;

import com.lms.entity.BookIssued;

import java.time.LocalDate;

public record IssuedBookResponse(
        Long issueId,
        Long bookId, String title, String author, String isbn,
        Long userId, String firstName, String lastName, String email,
        LocalDate issueDate, LocalDate dueDate, LocalDate returnDate,
        String status, String dueDayStatus,
        String bookCondition, String assignmentNotes, String returnNotes) {

    public static IssuedBookResponse from(BookIssued bi) {
        return new IssuedBookResponse(
                bi.getIssueId(),
                bi.getBook().getBookId(), bi.getBook().getTitle(), bi.getBook().getAuthor(), bi.getBook().getIsbn(),
                bi.getUser().getUserId(), bi.getUser().getFirstName(), bi.getUser().getLastName(),
                bi.getUser().getEmail(),
                bi.getIssueDate(), bi.getDueDate(), bi.getReturnDate(),
                bi.getStatus(), dueDayStatus(bi.getDueDate()),
                bi.getBookCondition(), bi.getAssignmentNotes(), bi.getReturnNotes());
    }

    /** Same three labels the original controllers computed: Overdue / Due Today / Active. */
    static String dueDayStatus(LocalDate dueDate) {
        LocalDate today = LocalDate.now();
        if (dueDate.isBefore(today)) {
            return "Overdue";
        }
        if (dueDate.isEqual(today)) {
            return "Due Today";
        }
        return "Active";
    }
}
