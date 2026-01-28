package com.staff_portal.academic_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Column(name = "address_line1", nullable = false)
    private String line1;

    @Column(name = "address_line2")
    private String line2;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "country", nullable = false, length = 20)
    private String country;

    @Column(name = "postal_code", nullable = false, length = 6)
    private Long postalCode;
}
