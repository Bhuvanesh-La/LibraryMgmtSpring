package com.lms.controller;

import com.lms.dto.CreatedUserResponse;
import com.lms.dto.UserRequest;
import com.lms.dto.UserResponse;
import com.lms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> all() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public UserResponse one(@PathVariable long id) {
        return userService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedUserResponse create(@Valid @RequestBody UserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable long id, @Valid @RequestBody UserRequest request) {
        return userService.update(id, request);
    }
}
