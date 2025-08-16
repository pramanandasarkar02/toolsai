package com.toolsai.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name cannot exceed 100 characters")
    @Column(unique = true, name = "org_name", nullable = false)
    private String orgName;

    @NotBlank(message = "Organization URL is required")
    @Size(max = 255, message = "Organization URL cannot exceed 255 characters")
    @URL(message = "Organization URL must be valid")
    @Column(unique = true, name = "org_url", nullable = false)
    private String orgUrl;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description")
    private String description;

    @NotBlank(message = "Organization secret is required")
    @Size(min = 8, max = 255, message = "Organization secret must be between 8 and 255 characters")
    @Column(name = "org_secret", nullable = false)
    private String orgSecret;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;
}