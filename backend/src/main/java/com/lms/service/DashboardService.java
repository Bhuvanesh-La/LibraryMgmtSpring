package com.lms.service;

import com.lms.dto.DashboardResponse;
import com.lms.dto.IssuedBookResponse;
import com.lms.entity.BookIssued;
import com.lms.repository.BookIssuedRepository;
import com.lms.repository.BookRepository;
import com.lms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookIssuedRepository issuedRepository;

    public DashboardService(BookRepository bookRepository, UserRepository userRepository,
                            BookIssuedRepository issuedRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.issuedRepository = issuedRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        List<IssuedBookResponse> issued = issuedRepository
                .findTop10ByStatusOrderByIssueIdDesc(BookIssued.STATUS_ISSUED).stream()
                .map(IssuedBookResponse::from).toList();

        return new DashboardResponse(
                bookRepository.count(),
                issuedRepository.countByStatus(BookIssued.STATUS_ISSUED),
                issuedRepository.countByStatus(BookIssued.STATUS_RETURN),
                userRepository.countByRole("USER"),
                issued);
    }
}
