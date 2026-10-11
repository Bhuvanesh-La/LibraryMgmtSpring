package com.lms.controller;

import com.lms.dto.BookRequest;
import com.lms.dto.BookResponse;
import com.lms.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BookResponse> all() {
        return bookService.getAll();
    }

    @GetMapping("/available")
    public List<BookResponse> available() {
        return bookService.getAvailable();
    }

    @GetMapping("/{id}")
    public BookResponse one(@PathVariable long id) {
        return bookService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse create(@Valid @RequestBody BookRequest request) {
        return bookService.create(request);
    }

    @PutMapping("/{id}")
    public BookResponse update(@PathVariable long id, @Valid @RequestBody BookRequest request) {
        return bookService.update(id, request);
    }
}
