package com.lms.repository;

import com.lms.entity.BookIssued;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookIssuedRepository extends JpaRepository<BookIssued, Long> {

    @EntityGraph(attributePaths = {"book", "user"})
    List<BookIssued> findByStatusOrderByIssueIdDesc(String status);

    @EntityGraph(attributePaths = {"book", "user"})
    List<BookIssued> findTop10ByStatusOrderByIssueIdDesc(String status);

    @EntityGraph(attributePaths = {"book", "user"})
    @Query("select bi from BookIssued bi where bi.issueId = :id")
    Optional<BookIssued> findDetailedById(@Param("id") Long id);

    long countByStatus(String status);
}
