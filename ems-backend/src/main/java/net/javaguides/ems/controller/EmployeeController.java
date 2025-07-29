package net.javaguides.ems.controller;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.service.EmployeeService;

import java.util.List;

// It contains predefined HttpStatus codes like (200 - OK, 201 - CREATED) etc.
import org.springframework.http.HttpStatus;

// ResponseEntity is used to send back data + status code (like 201 created)
// to the client
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// These are used to handle HTTP requests
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

// @RequestMapping("/api/employees") - sets base path for all the endpoints 
// in this class. So, any API call will begin with /api/employees
import org.springframework.web.bind.annotation.RequestMapping;

// @RestController tells that this class will handle REST API requests.
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.RequestParam;



@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    private EmployeeService employeeService;

    // @PostMapping indicates that the below method will run when someone 
    // sends a POST request to /api/employees. It is used to add an employee. 
    // @RequestBody tells Spring Boot to take JSON sent in the request and 
    // convert it into EmployeeDto object.
    // The return type of the method indicates that we will return an 
    // EmployeeDto object wrapped in a response, along with an HTTP status code.
    
    // Build Add Employee REST API
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        // here employeeService is a reference variable of interface EmployeeService
        // But it only have method declaration but not definition. 
        // Here the Spring Boot creates an object by itself by finding the class 
        // which implements the interface. 
        // It finds the class with the help of the annotation @Service 
        EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);
        // HttpStatus.CREATED sends the status (201 created) to indicate that
        // successful post has been done. 
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // @GetMapping is used to get the employee based on the path provided (id)
    // The employeeId is mapped with path (id) using @PathVariable("id")
    // Build Get Employee REST API
    @GetMapping("{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long employeeId) {
        EmployeeDto employeeDto = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employeeDto);
    }

    // Build Get All Employees REST API 
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
    
    // @PutMapping is used update an employee based on the provided id
    // Update Employee REST API 
    @PutMapping("{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") Long employeeId, 
                                                    @RequestBody EmployeeDto updatedEmployee) {
        EmployeeDto employeeDto = employeeService.updateEmployee(employeeId, updatedEmployee);
        return ResponseEntity.ok(employeeDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("id") Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok("Employee with id " + employeeId + " deleted successfully.");
    }
}