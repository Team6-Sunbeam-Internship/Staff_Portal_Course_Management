package com.staff_portal.user_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "menu_item_id")
    private UUID id;
    @Column(nullable = false)
    private String title;

    private String description;

    private String path;

    @Column(name = "parent_key")
    private String parentKey;

    @Column(name = "full_path_key", nullable = false, unique = true)
    private String fullPathKey;
}
