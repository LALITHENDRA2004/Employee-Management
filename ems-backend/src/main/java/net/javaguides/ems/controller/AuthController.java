package net.javaguides.ems.controller;

import net.javaguides.ems.dto.JwtResponse;
import net.javaguides.ems.dto.UserRequestDto;
import net.javaguides.ems.entity.User;
import net.javaguides.ems.repository.UserRepository;
import net.javaguides.ems.security.JwtTokenUtil;

import java.util.Optional;
import java.util.Collections;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRequestDto userRequest) {
        if (userRepository.existsByUserName(userRequest.getUserName())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Username is already taken."));
        }

        // Encode the password and save the user
        User user = new User();
        user.setUserName(userRequest.getUserName());
        user.setPasswordHash(passwordEncoder.encode(userRequest.getPassword()));
        userRepository.save(user);

        try {
            // Authenticate newly registered user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUserName(),
                            userRequest.getPassword()));

            // Generate JWT token for the user
            String jwt = jwtTokenUtil.generateToken(userRequest.getUserName());

            // Return the token in the response
            return ResponseEntity.ok(new JwtResponse(jwt));

        } catch (AuthenticationException ex) {
            // Fallback: return success message without token if authentication fails for
            // some reason
            return ResponseEntity.ok(
                    Collections.singletonMap("message", "User registered successfully, but failed to authenticate."));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody UserRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUserName(),
                            loginRequest.getPassword()));

            String jwt = jwtTokenUtil.generateToken(loginRequest.getUserName());

            return ResponseEntity.ok(new JwtResponse(jwt));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody net.javaguides.ems.dto.ForgotPasswordRequestDto resetRequest) {
        Optional<User> userOpt = userRepository.findByUserName(resetRequest.getUserName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "User not found"));
        }

        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(resetRequest.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Collections.singletonMap("message", "Password reset successfully"));
    }
}
