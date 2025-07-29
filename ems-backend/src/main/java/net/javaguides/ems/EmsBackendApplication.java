package net.javaguides.ems;

// SpringApplication class used to start the application 
import org.springframework.boot.SpringApplication;

// Allows to use @SpringBootApplication
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication - used to mark the main class
// It combines 3 annotations which we do not write manually 
// 1. @SpringBootConfiguration - Tells that it is a Configuration class 
// 								 which means, it contains configuration details 
// 2. @SpringBootAutoConfiguration - Configures automatically based on dependencies 
// 3. @ComponentScan - It starts scanning the same package and sub-packages of this class. 
//                     It automaically detects, @RestController, @Service etc.
@SpringBootApplication 
public class EmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmsBackendApplication.class, args);
	}

}
