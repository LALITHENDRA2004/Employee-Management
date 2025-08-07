package net.javaguides.ems.repository;

// Purpose of this interface: To define/perform CRUD operations on the 
// Employee entity

import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.ems.entity.Employee;

// JpaRepository contains all the necessary methods. Just it is enough if 
// we extend it
// SimpleJpaRepository is a class which already implements JpaRepository.
// We do not need to design our own class again
// It contains database methods like save(), findById() etc for Employee 
// entities.
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
}