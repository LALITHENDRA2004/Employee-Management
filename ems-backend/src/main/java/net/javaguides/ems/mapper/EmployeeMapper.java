package net.javaguides.ems.mapper;

// The Mapper class is used to convert between EmployeeDto and Employee 
// objects.
// The client only interacts with the EmployeeDto class, which is used to 
// transfer data.
// Internally, the business logic and database operations work with the 
// Employee entity.
// When responding to the client, the Employee entity is converted back into
//  an EmployeeDto.


import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;

public class EmployeeMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        return new EmployeeDto(
            employee.getId(), 
            employee.getFirstName(), 
            employee.getLastName(), 
            employee.getEmail()
        );
    }

    public static Employee mapToEmployee(EmployeeDto employeeDto) {
        return new Employee(
            employeeDto.getId(),
            employeeDto.getFirstName(),
            employeeDto.getLastName(),
            employeeDto.getEmail()
        );
    }
}