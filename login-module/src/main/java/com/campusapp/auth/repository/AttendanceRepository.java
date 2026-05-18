package com.campusapp.auth.repository;

import com.campusapp.auth.entity.Attendance;
import com.campusapp.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentOrderByAttendanceDateDesc(User student);
    Optional<Attendance> findByStudentAndAttendanceDate(User student, LocalDate attendanceDate);
}
