package com.toolsai.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrganizationRequest {
    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name cannot exceed 100 characters")
    private String orgName;

    @NotBlank(message = "Organization URL is required")
    @Size(max = 255, message = "Organization URL cannot exceed 255 characters")
    @URL(message = "Organization URL must be valid")
    private String orgUrl;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Organization secret is required")
    @Size(min = 8, max = 255, message = "Organization secret must be between 8 and 255 characters")
    private String orgSecret;
}