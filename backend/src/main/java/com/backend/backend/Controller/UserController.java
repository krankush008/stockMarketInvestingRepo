package com.backend.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.backend.Constants.Constants;
import com.backend.backend.Entity.User;
import com.backend.backend.Entity.UserErrorResponse;
import com.backend.backend.Repository.UserRepository;
import java.util.Optional;

@RestController
@RequestMapping(Constants.USERS_BACKEND_ROUTE)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping(Constants.USER_ROUTE)
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/createUser")
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/updateUser/{id}")
    @CrossOrigin(origins = Constants.CORS_ORIGIN)
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUserData) {
        // Find the existing user by ID
        if (!userRepository.existsById(id)) {
            // If not found, return a 404 Not Found response
             String errorMessage = "User with ID " + id + " not found";
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new UserErrorResponse(id, errorMessage)
            );
        }
        // Save the updated user to the database
        User updatedUser = userRepository.save(updatedUserData);
        return ResponseEntity.ok(updatedUser);
    }    
}
