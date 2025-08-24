package com.staff_portal.auth_service.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class DateTimeUtil {

    public LocalDateTime getDateTime(){
        ZoneId zoneId = ZoneId.of("Asia/Kolkata");
        return LocalDateTime.now(zoneId);
    }
}