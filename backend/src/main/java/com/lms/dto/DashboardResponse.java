package com.lms.dto;

import java.util.List;

public record DashboardResponse(long totalBooks, long booksAssigned, long booksReturned, long totalUsers,
                                List<IssuedBookResponse> issuedBooks) {
}
