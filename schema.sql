-- Reference schema (inferred from the original DAO queries).
-- You do NOT need to run this: the Spring Boot app creates/updates these tables
-- automatically (spring.jpa.hibernate.ddl-auto=update). It is provided for documentation.

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS users (
    USER_ID     BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(255) NOT NULL,
    last_name   VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,          -- BCrypt hash (legacy plain text is upgraded on first login)
    role        VARCHAR(20)  NOT NULL,          -- 'ADMIN' or 'USER'
    phone_no    VARCHAR(255),
    address     VARCHAR(255),
    created_at  DATE
);

CREATE TABLE IF NOT EXISTS books (
    book_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    author           VARCHAR(255) NOT NULL,
    category         VARCHAR(255),
    isbn             VARCHAR(255),
    publisher        VARCHAR(255),
    total_copies     INT NOT NULL,
    available_copies INT NOT NULL,
    created_at       DATE,
    status           VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS book_issued (
    issue_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id          BIGINT NOT NULL,
    USER_ID          BIGINT NOT NULL,
    issue_date       DATE NOT NULL,
    due_date         DATE NOT NULL,
    return_date      DATE,
    status           VARCHAR(20) NOT NULL,      -- 'ISSUED' or 'RETURN'
    book_condition   VARCHAR(255),
    assignment_notes VARCHAR(1000),
    return_notes     VARCHAR(1000),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (USER_ID) REFERENCES users(USER_ID)
);
