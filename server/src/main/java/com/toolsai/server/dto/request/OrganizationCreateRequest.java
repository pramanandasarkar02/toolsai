package com.toolsai.server.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class OrganizationCreateRequest {
    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name cannot exceed 100 characters")
    private String orgName;

    @Size(max = 100, message = "Organization slug cannot exceed 100 characters")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Organization slug can only contain lowercase letters, numbers, and hyphens")
    private String orgSlug;

    @NotBlank(message = "Organization URL is required")
    @Size(max = 255, message = "Organization URL cannot exceed 255 characters")
    @URL(message = "Organization URL must be valid")
    private String orgUrl;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String logoUrl;
}