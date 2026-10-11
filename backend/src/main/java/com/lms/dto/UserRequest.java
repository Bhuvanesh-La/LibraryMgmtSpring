package com.lms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Used for both create and update (email is ignored on update, as in the original app). */
public record UserRequest(
        @NotBlank(message = "Please enter the first name.") String firstName,
        @NotBlank(message = "Please enter the last name.") String lastName,
        @NotBlank(message = "Please enter the email address.") @Email(message = "Please enter a valid email address.") String email,
        @NotBlank(message = "Please enter the phone number.") String phone,
        @NotBlank(message = "Please enter the address.") String address) {
}
