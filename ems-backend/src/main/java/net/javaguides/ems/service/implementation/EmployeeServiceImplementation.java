package net.javaguides.ems.service.implementation;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.User;
import net.javaguides.ems.exception.ResourceNotFoundException;
import net.javaguides.ems.mapper.EmployeeMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.service.EmployeeService;

// @Service indicates that it is a service class which means the class which 
// the business logic.

@Service
@AllArgsConstructor
public class EmployeeServiceImplementation implements EmployeeService {
    // used to interact with the database
    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto, User user) {
        
        Employee existingEmployee = employeeRepository.findByEmail(employeeDto.getEmail()).orElse(null);
        
        if (existingEmployee != null) {
            throw new ResourceNotFoundException("Employee with email " + employeeDto.getEmail() + " already exists");
        }

        // converts EmployeeDto object to Employee entity to get stored in db
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto, user);
        employee.setUser(user);

        // save() - runs an insert query if employee do not exits 
        //        - runs an update query if it already exists
        Employee savedEmployee = employeeRepository.save(employee);

        // Again convert to employeeDto to sendt back to the client
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId, User user) {
        Employee employee = employeeRepository.findById(employeeId)
            .filter(emp -> emp.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResourceNotFoundException("Employee do not exist with given id: " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees(User user) {
        List<Employee> employees = employeeRepository.findByUser(user);
        return employees.stream().map((employee) -> EmployeeMapper.mapToEmployeeDto(employee))
            .collect(Collectors.toList());
    } 

    // Gets an updatedEmployee obj and sets its values to a new object based 
    // on the id and again returns the object 
    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee, User user) {
        Employee employee = employeeRepository.findById(employeeId) 
            .filter(emp -> emp.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResourceNotFoundException("Employee do not exist with given id: " + employeeId));
        employee.setFirstName(updatedEmployee.getFirstName());
        employee.setLastName(updatedEmployee.getLastName());
        employee.setEmail(updatedEmployee.getEmail());

        // Performs both update and save operations
        Employee updatedEmployeeObj = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(updatedEmployeeObj);
    }

    @Override
    public void deleteEmployee(Long employeeId, User user) {
        Employee employee = employeeRepository.findById(employeeId)
            .filter(emp -> emp.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new ResourceNotFoundException("Employee do not exist with given id: " + employeeId));
            employeeRepository.delete(employee);
    }
}