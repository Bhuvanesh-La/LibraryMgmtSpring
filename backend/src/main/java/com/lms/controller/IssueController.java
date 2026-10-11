package com.lms.controller;

import com.lms.dto.AssignBookRequest;
import com.lms.dto.IssuedBookResponse;
import com.lms.dto.ReturnBookRequest;
import com.lms.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    /** Currently issued (not yet returned) books - the "Return Book" list. */
    @GetMapping
    public List<IssuedBookResponse> active() {
        return issueService.getActiveIssues();
    }

    @GetMapping("/{id}")
    public IssuedBookResponse one(@PathVariable long id) {
        return issueService.getById(id);
    }

    /** Assign a book to a member. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssuedBookResponse assign(@Valid @RequestBody AssignBookRequest request) {
        return issueService.assign(request);
    }

    /** Record the return of an issued book. */
    @PostMapping("/{id}/return")
    public IssuedBookResponse returnBook(@PathVariable long id, @Valid @RequestBody ReturnBookRequest request) {
        return issueService.returnBook(id, request);
    }
}
