package com.toolsai.server.dto.response;

import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.model.enums.PricingType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AIModelResponse {
    private Long id;
    private String modelName;
    private String modelSlug;
    private String modelDescription;
    private String modelVersion;
    private ModelCategory modelCategory;
    private PricingType pricingType;
    private BigDecimal modelPrice;
    private String currency;
    private String pricingUnit;
    private String apiUrl;
    private String documentationUrl;
    private String modelImageUrl;
    private ModelStatus modelStatus;
    private Boolean isFeatured;
    private Integer likeCount;
    private Integer commentCount;
    private Long viewCount;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private OrganizationResponse organization;
    private List<TagResponse> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}