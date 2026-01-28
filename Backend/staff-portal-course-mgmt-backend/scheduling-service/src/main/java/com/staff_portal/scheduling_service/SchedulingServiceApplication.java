package com.staff_portal.scheduling_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
@EnableCaching
public class SchedulingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchedulingServiceApplication.class, args);
	}

}
