package com.lms.service;

import com.lms.dto.AssignBookRequest;
import com.lms.dto.IssuedBookResponse;
import com.lms.dto.ReturnBookRequest;
import com.lms.entity.Book;
import com.lms.entity.BookIssued;
import com.lms.entity.User;
import com.lms.exception.ApiException;
import com.lms.repository.BookIssuedRepository;
import com.lms.repository.BookRepository;
import com.lms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Assign / return logic. The original did the "decrement copies, then insert, then manually undo on failure"
 * dance by hand; here it is a single transaction so it either all happens or none of it does.
 */
@Service
public class IssueService {

    private final BookIssuedRepository issuedRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public IssueService(BookIssuedRepository issuedRepository, BookRepository bookRepository,
                        UserRepository userRepository) {
        this.issuedRepository = issuedRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<IssuedBookResponse> getActiveIssues() {
        return issuedRepository.findByStatusOrderByIssueIdDesc(BookIssued.STATUS_ISSUED).stream()
                .map(IssuedBookResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public IssuedBookResponse getById(long id) {
        return IssuedBookResponse.from(findIssue(id));
    }

    @Transactional
    public IssuedBookResponse assign(AssignBookRequest req) {
        Book book = bookRepository.findByIdForUpdate(req.bookId())
                .orElseThrow(() -> ApiException.notFound("Book data not found.!!"));
        User user = userRepository.findByUserIdAndRole(req.userId(), "USER")
                .orElseThrow(() -> ApiException.notFound("User not found!!"));

        if (book.getAvailableCopies() <= 0) {
            throw ApiException.conflict("No copies of this book are currently available.");
        }
        if (req.dueDate().isBefore(LocalDate.now())) {
            throw ApiException.badRequest("Due date cannot be in the past.");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BookIssued issue = new BookIssued();
        issue.setBook(book);
        issue.setUser(user);
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(req.dueDate());
        issue.setStatus(BookIssued.STATUS_ISSUED);
        issue.setAssignmentNotes(blankToNull(req.assignmentNotes()));
        return IssuedBookResponse.from(issuedRepository.save(issue));
    }

    @Transactional
    public IssuedBookResponse returnBook(long issueId, ReturnBookRequest req) {
        BookIssued issue = findIssue(issueId);
        if (!BookIssued.STATUS_ISSUED.equals(issue.getStatus())) {
            throw ApiException.conflict("This book has already been returned.");
        }
        if (req.returnDate().isBefore(issue.getIssueDate())) {
            throw ApiException.badRequest("Return date cannot be before the issue date.");
        }

        Book book = bookRepository.findByIdForUpdate(issue.getBook().getBookId())
                .orElseThrow(() -> ApiException.notFound("Book data not found.!!"));
        book.setAvailableCopies(Math.min(book.getAvailableCopies() + 1, book.getTotalCopies()));
        bookRepository.save(book);

        issue.setReturnDate(req.returnDate());
        issue.setBookCondition(req.bookCondition().trim());
        issue.setReturnNotes(blankToNull(req.returnNotes()));
        issue.setStatus(BookIssued.STATUS_RETURN);
        return IssuedBookResponse.from(issuedRepository.save(issue));
    }

    private BookIssued findIssue(long id) {
        return issuedRepository.findDetailedById(id)
                .orElseThrow(() -> ApiException.notFound("Issued book record not found."));
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
