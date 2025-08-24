package com.toolsai.server.model;

import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.model.enums.PricingType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ai_models")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_slug", nullable = false, unique = true, length = 100)
    private String modelSlug;

    @Column(name = "model_description", length = 2000)
    private String modelDescription;

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "model_category", nullable = false)
    private ModelCategory modelCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_type", nullable = false)
    private PricingType pricingType;

    @Column(name = "model_price", precision = 10, scale = 2)
    private BigDecimal modelPrice;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "pricing_unit", length = 100)
    private String pricingUnit;

    @Column(name = "api_url")
    private String apiUrl;

    @Column(name = "documentation_url")
    private String documentationUrl;

    @Column(name = "model_image_url")
    private String modelImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "model_status")
    @Builder.Default
    private ModelStatus modelStatus = ModelStatus.PENDING_APPROVAL;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "like_count")
    @Builder.Default
    private Integer likeCount = 0;

    @Column(name = "comment_count")
    @Builder.Default
    private Integer commentCount = 0;

    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "ai_model_tags",
            joinColumns = @JoinColumn(name = "ai_model_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    @OneToMany(mappedBy = "aiModel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelComment> comments;

    @OneToMany(mappedBy = "aiModel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelLike> likes;

    @OneToMany(mappedBy = "aiModel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelRating> ratings;
}
