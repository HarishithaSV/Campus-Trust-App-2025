package com.campusapp.auth.dto;

import com.campusapp.auth.entity.AttendanceStatus;

import java.time.LocalDate;

public class AttendanceRequest {
    private LocalDate date;
    private AttendanceStatus status;
    private String remark;

    public AttendanceRequest() {
    }

    public AttendanceRequest(LocalDate date, AttendanceStatus status, String remark) {
        this.date = date;
        this.status = status;
        this.remark = remark;
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
