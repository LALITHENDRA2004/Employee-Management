package net.javaguides.ems.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequestDto {

    @NotBlank(message = "Username is required")
    private String userName;

    @NotBlank(message = "New password is required")
    private String newPassword;
}
