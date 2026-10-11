package com.lms.dto;

/** Returned once on user creation so the admin can hand over the generated temporary password. */
public record CreatedUserResponse(UserResponse user, String temporaryPassword) {
}
