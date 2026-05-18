package com.campusapp.auth.service;

import com.campusapp.auth.dto.AttendanceDto;
import com.campusapp.auth.dto.AttendanceRequest;
import com.campusapp.auth.dto.ProfileUpdateRequest;
import com.campusapp.auth.dto.AuthResponse;
import com.campusapp.auth.entity.Attendance;
import com.campusapp.auth.entity.AttendanceStatus;
import com.campusapp.auth.entity.User;
import com.campusapp.auth.repository.AttendanceRepository;
import com.campusapp.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    public AuthResponse.UserDto getProfile(String username) {
        User student = findStudentByUsername(username);
        return AuthResponse.UserDto.fromUser(student);
    }

    public AuthResponse.UserDto updateProfile(String username, ProfileUpdateRequest request) {
        User student = findStudentByUsername(username);

        if (request.getFirstName() != null) {
            student.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            student.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            student.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getProfilePictureUrl() != null) {
            student.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        student.setUpdatedAt(LocalDateTime.now());
        userRepository.save(student);
        logger.info("Updated profile for student: {}", student.getUsername());
        return AuthResponse.UserDto.fromUser(student);
    }

    public List<AttendanceDto> getAttendance(String username) {
        User student = findStudentByUsername(username);
        return attendanceRepository.findByStudentOrderByAttendanceDateDesc(student)
                .stream()
                .map(AttendanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    public AttendanceDto markAttendance(String username, AttendanceRequest request) {
        User student = findStudentByUsername(username);
        LocalDate attendanceDate = request.getDate() != null ? request.getDate() : LocalDate.now();
        AttendanceStatus status = Optional.ofNullable(request.getStatus()).orElse(AttendanceStatus.PRESENT);

        Attendance attendance = attendanceRepository.findByStudentAndAttendanceDate(student, attendanceDate)
                .orElse(Attendance.builder()
                        .student(student)
                        .attendanceDate(attendanceDate)
                        .build());

        attendance.setStatus(status);
        attendance.setRemark(request.getRemark());
        attendance.setUpdatedAt(LocalDateTime.now());

        if (attendance.getCreatedAt() == null) {
            attendance.setCreatedAt(LocalDateTime.now());
        }

        attendanceRepository.save(attendance);
        logger.info("Attendance recorded for {} on {}: {}", student.getUsername(), attendanceDate, status);
        return AttendanceDto.fromEntity(attendance);
    }

    private User findStudentByUsername(String username) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getRole() == User.UserRole.STUDENT)
                .orElseThrow(() -> new IllegalArgumentException("Student account not found or invalid role"));
    }
}
