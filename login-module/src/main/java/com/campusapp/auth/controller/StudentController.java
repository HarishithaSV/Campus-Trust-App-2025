package com.campusapp.auth.controller;

import com.campusapp.auth.dto.AttendanceDto;
import com.campusapp.auth.dto.AttendanceRequest;
import com.campusapp.auth.dto.AuthResponse;
import com.campusapp.auth.dto.ProfileUpdateRequest;
import com.campusapp.auth.service.StudentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8000"})
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            AuthResponse.UserDto profile = studentService.getProfile(authentication.getName());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Failed to load student profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse(e));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                           @Valid @RequestBody ProfileUpdateRequest request) {
        try {
            AuthResponse.UserDto updatedProfile = studentService.updateProfile(authentication.getName(), request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            logger.error("Failed to update student profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse(e));
        }
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendance(Authentication authentication) {
        try {
            List<AttendanceDto> attendance = studentService.getAttendance(authentication.getName());
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            logger.error("Failed to load attendance records: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse(e));
        }
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(Authentication authentication,
                                            @Valid @RequestBody AttendanceRequest request) {
        try {
            AttendanceDto attendance = studentService.markAttendance(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (Exception e) {
            logger.error("Failed to record attendance: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse(e));
        }
    }

    private Map<String, String> errorResponse(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", "error");
        return error;
    }
}
