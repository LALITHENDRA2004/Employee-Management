package net.javaguides.ems.mapper;

// The Mapper class is used to convert between EmployeeDto and Employee 
// objects.
// The client only interacts with the EmployeeDto class, which is used to 
// transfer data.
// Internally, the business logic and database operations work with the 
// Employee entity.
// When responding to the client, the Employee entity is converted back into
// an EmployeeDto.


import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.User;

public class EmployeeMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto(
            employee.getId(), 
            employee.getFirstName(), 
            employee.getLastName(),
            employee.getEmail()
        );
        if (employee.getUser() != null) {
            dto.setUserId(employee.getUser().getId());
        }
        return dto;
    }

    public static Employee mapToEmployee(EmployeeDto employeeDto, User user) {
        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        employee.setUser(user);
        return employee;
    }
}