package com.lms.service;

import com.lms.dto.BookRequest;
import com.lms.dto.BookResponse;
import com.lms.entity.Book;
import com.lms.exception.ApiException;
import com.lms.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAll() {
        return bookRepository.findAllByOrderByBookIdDesc().stream().map(BookResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAvailable() {
        return bookRepository.findByAvailableCopiesGreaterThanOrderByTitleAsc(0).stream()
                .map(BookResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public BookResponse getById(long id) {
        return BookResponse.from(find(id));
    }

    @Transactional
    public BookResponse create(BookRequest req) {
        int available = req.availableCopies() != null ? req.availableCopies() : req.totalCopies();
        if (available < 0 || available > req.totalCopies()) {
            throw ApiException.badRequest("Available copies must be between 0 and the number of copies.");
        }

        Book book = new Book();
        apply(book, req);
        book.setTotalCopies(req.totalCopies());
        book.setAvailableCopies(available);
        book.setCreatedAt(LocalDate.now());
        book.setStatus("AVAILABLE");
        return BookResponse.from(bookRepository.save(book));
    }

    @Transactional
    public BookResponse update(long id, BookRequest req) {
        Book book = find(id);

        // Copies currently out on loan. Keeping this constant means editing the total
        // never leaves the available count inconsistent.
        int issued = book.getTotalCopies() - book.getAvailableCopies();
        if (req.totalCopies() < issued) {
            throw ApiException.badRequest(
                    "Number of copies cannot be less than the " + issued + " copies currently issued.");
        }

        apply(book, req);
        book.setTotalCopies(req.totalCopies());
        book.setAvailableCopies(req.totalCopies() - issued);
        return BookResponse.from(bookRepository.save(book));
    }

    private void apply(Book book, BookRequest req) {
        book.setTitle(req.title().trim());
        book.setAuthor(req.author().trim());
        book.setIsbn(req.isbn().trim());
        book.setCategory(req.category().trim());
        book.setPublisher(req.publisher().trim());
    }

    private Book find(long id) {
        return bookRepository.findById(id).orElseThrow(() -> ApiException.notFound("Book data not found.!!"));
    }
}
