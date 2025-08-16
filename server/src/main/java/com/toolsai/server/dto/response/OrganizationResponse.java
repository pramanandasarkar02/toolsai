package com.toolsai.server.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.toolsai.server.model.Organization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationResponse {
    private Long id;
    private String orgName;
    private String orgUrl;
    private String description;
    private boolean isActive;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime joinedAt;

    // Constructor to map from Organization entity
    public OrganizationResponse(Organization organization) {
        this.id = organization.getId();
        this.orgName = organization.getOrgName();
        this.orgUrl = organization.getOrgUrl();
        this.description = organization.getDescription();
        this.isActive = organization.isActive();
        this.createdAt = organization.getCreatedAt();
        this.updatedAt = organization.getUpdatedAt();
        this.joinedAt = organization.getJoinedAt();
    }
}