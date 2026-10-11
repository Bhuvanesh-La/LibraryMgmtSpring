package com.lms.dto;

import com.lms.entity.User;

public record UserResponse(Long userId, String firstName, String lastName, String email, String phone,
                           String address) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getUserId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getPhoneNo(),
                u.getAddress());
    }
}
