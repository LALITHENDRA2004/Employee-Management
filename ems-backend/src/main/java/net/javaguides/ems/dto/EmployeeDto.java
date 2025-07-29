package net.javaguides.ems.dto;

// EmployeeDto class is used to transfer data between the client and the server.
// Instead of using the Employee entity directly, we created a separate class called 
// EmployeeDto to improve security and flexibility.
// This allows us to control what data is exposed to or received from the user.
// We can customize the data structure sent to the client by including only required fields.
// We map between the Employee and EmployeeDto classes in the service layer to use them interchangeably.

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}