package com.toolsai.server.dto.request;

import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.model.enums.PricingType;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AIModelCreateRequest {
    @NotBlank(message = "Model name is required")
    @Size(max = 100, message = "Model name cannot exceed 100 characters")
    private String modelName;

    @NotBlank(message = "Model slug is required")
    @Size(max = 100, message = "Model slug cannot exceed 100 characters")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Model slug can only contain lowercase letters, numbers, and hyphens")
    private String modelSlug;

    @Size(max = 2000, message = "Model description cannot exceed 2000 characters")
    private String modelDescription;

    @NotBlank(message = "Model version is required")
    @Size(max = 50, message = "Model version cannot exceed 50 characters")
    private String modelVersion;

    @NotNull(message = "Model category is required")
    private ModelCategory modelCategory;

    @NotNull(message = "Pricing type is required")
    private PricingType pricingType;

    @DecimalMin(value = "0.0", message = "Model price cannot be negative")
    private BigDecimal modelPrice;

    @Size(max = 10, message = "Currency cannot exceed 10 characters")
    private String currency;

    @Size(max = 100, message = "Pricing unit cannot exceed 100 characters")
    private String pricingUnit;

    @URL(message = "API URL must be valid")
    private String apiUrl;

    @URL(message = "Documentation URL must be valid")
    private String documentationUrl;

    private String modelImageUrl;

    @NotNull(message = "Organization ID is required")
    private Long organizationId;

    private List<String> tagNames;
}