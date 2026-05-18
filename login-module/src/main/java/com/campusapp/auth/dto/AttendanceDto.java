package com.campusapp.auth.dto;

import com.campusapp.auth.entity.Attendance;
import com.campusapp.auth.entity.AttendanceStatus;

import java.time.LocalDate;

public class AttendanceDto {
    private Long id;
    private LocalDate date;
    private AttendanceStatus status;
    private String remark;

    public AttendanceDto() {
    }

    public AttendanceDto(Long id, LocalDate date, AttendanceStatus status, String remark) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.remark = remark;
    }

    public static AttendanceDto fromEntity(Attendance attendance) {
        return new AttendanceDto(
                attendance.getId(),
                attendance.getAttendanceDate(),
                attendance.getStatus(),
                attendance.getRemark()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
