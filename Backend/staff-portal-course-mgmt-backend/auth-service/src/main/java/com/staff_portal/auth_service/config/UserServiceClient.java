package com.staff_portal.auth_service.config;

import com.staff_portal.auth_service.dto.request.UserBaseRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.dto.response.StaffProfileResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange("/staff")
public interface UserServiceClient {

    // Post Request
    @PostExchange(url = "/create/")
    ApiResponse<String> createStaffProfile(
            @RequestBody UserBaseRequestDTO request,
            @RequestHeader("Authorization") String authorization);

    @GetExchange(url = "/getStaffProfile")
    StaffProfileResponseDTO getStaffProfile(
            @RequestHeader("Authorization") String authorization
    );
}
