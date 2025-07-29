package net.javaguides.ems.entity;

// This is Entity class - it connects java code to a database
// @Entity - It marks the class as JPA entity (a class that should be mapped 
//           with database)
// Here the variable which are defined in the class are mapped with respective 
// columns in the data base using @Column annotation.

// JPA is used to map the class with data base

// @Column - used to customise column names
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

// @Id - used to indicate primary key
import jakarta.persistence.Id;

// Used to auto-increment the primary key 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

// @Table - used to specify table name
import jakarta.persistence.Table;

// lombok allows to reduce boiler plate code 
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor 
@Entity 
@Table(name = "employees")  
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email_id", nullable = false, unique = true)
    private String email;
}