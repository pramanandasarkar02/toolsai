package com.toolsai.server.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrganizationResponse {
    private Long id;
    private String orgName;
    private String orgSlug;
    private String orgUrl;
    private String description;
    private String logoUrl;
    private LocalDateTime joinedAt;
    private Boolean isActive;
    private Boolean isVerified;
    private Integer totalModels;
    private Integer totalSubscribers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
