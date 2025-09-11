package net.javaguides.ems.service;

import java.util.List;
import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.User;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto, User user);

    EmployeeDto getEmployeeById(Long employeeId, User user);

    List<EmployeeDto> getAllEmployees(User user);

    EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee, User user);

    void deleteEmployee(Long employeeId, User user);
}