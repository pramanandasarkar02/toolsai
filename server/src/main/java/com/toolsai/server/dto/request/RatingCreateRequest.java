package com.toolsai.server.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingCreateRequest {
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @Size(max = 1000, message = "Review cannot exceed 1000 characters")
    private String review;
}