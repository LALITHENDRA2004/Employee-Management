package net.javaguides.ems.exception;

// Used to define HTTP response status codes (e.g., 404 Not Found, 200 OK)
import org.springframework.http.HttpStatus;

// Used to map the exception to a specific HTTP status when it's thrown.
import org.springframework.web.bind.annotation.ResponseStatus;

// Tells Spring that whenever this exception is raised, automatically respond 
// with HTTP status code 404 (Not Found)
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {

        // message is sent to parent class constructor (RuntimeException)
        super(message);
    }
}