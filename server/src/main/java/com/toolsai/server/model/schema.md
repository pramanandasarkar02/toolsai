// ============= ENUM CLASSES =============

package com.toolsai.server.model.enums;

public enum Role {
USER,
ADMIN,
MODERATOR,
ORGANIZATION_OWNER
}

package com.toolsai.server.model.enums;

public enum ModelCategory {
LANGUAGE_MODEL,
COMPUTER_VISION,
AUDIO_PROCESSING,
TEXT_TO_SPEECH,
SPEECH_TO_TEXT,
IMAGE_GENERATION,
VIDEO_PROCESSING,
NATURAL_LANGUAGE_PROCESSING,
MACHINE_LEARNING,
DEEP_LEARNING,
REINFORCEMENT_LEARNING,
RECOMMENDATION_SYSTEM,
CLASSIFICATION,
REGRESSION,
CLUSTERING,
ANOMALY_DETECTION,
TIME_SERIES,
OPTIMIZATION,
ROBOTICS,
AUTONOMOUS_SYSTEMS,
CHATBOT,
VIRTUAL_ASSISTANT,
TRANSLATION,
SENTIMENT_ANALYSIS,
TEXT_SUMMARIZATION,
QUESTION_ANSWERING,
CODE_GENERATION,
DATA_ANALYSIS,
PREDICTION,
OTHER
}

package com.toolsai.server.model.enums;

public enum ModelStatus {
ACTIVE,
INACTIVE,
PENDING_APPROVAL,
REJECTED,
MAINTENANCE,
DEPRECATED
}

package com.toolsai.server.model.enums;

public enum PricingType {
FREE,
FREEMIUM,
PAID,
SUBSCRIPTION,
PAY_PER_USE,
TIERED,
ENTERPRISE,
CUSTOM
}

package com.toolsai.server.model.enums;

public enum SubscriptionStatus {
ACTIVE,
INACTIVE,
PENDING,
CANCELLED,
EXPIRED,
SUSPENDED
}

package com.toolsai.server.model.enums;

public enum NotificationType {
MODEL_LIKED,
MODEL_COMMENTED,
MODEL_RATED,
MODEL_APPROVED,
MODEL_REJECTED,
ORGANIZATION_FOLLOWED,
SYSTEM_ANNOUNCEMENT,
SECURITY_ALERT,
PAYMENT_SUCCESS,
PAYMENT_FAILED,
SUBSCRIPTION_EXPIRED,
ACCOUNT_VERIFIED,
PASSWORD_CHANGED,
NEW_FOLLOWER,
COMMENT_REPLY,
MENTION,
WEEKLY_DIGEST,
MONTHLY_REPORT
}

// ============= MODEL CLASSES =============

package com.toolsai.server.model;

import com.toolsai.server.model.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name", length = 100)
    private String fullName;
    
    @Column(length = 500)
    private String bio;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;
    
    @Column(name = "verification_token")
    private String verificationToken;
    
    @Column(name = "reset_password_token")
    private String resetPasswordToken;
    
    @Column(name = "reset_password_expires_at")
    private LocalDateTime resetPasswordExpiresAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelComment> comments;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelLike> likes;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelRating> ratings;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserOrganizationSubscription> subscriptions;
    
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> receivedNotifications;
    
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> sentNotifications;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApiKey> apiKeys;
}

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

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
    
    @Column(name = "org_name", nullable = false, unique = true, length = 100)
    private String orgName;
    
    @Column(name = "org_slug", unique = true, length = 100)
    private String orgSlug;
    
    @Column(name = "org_url", nullable = false, unique = true)
    private String orgUrl;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Column(name = "org_secret", nullable = false)
    private String orgSecret;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;
    
    @Column(name = "total_models")
    @Builder.Default
    private Integer totalModels = 0;
    
    @Column(name = "total_subscribers")
    @Builder.Default
    private Integer totalSubscribers = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModel> aiModels;
    
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserOrganizationSubscription> subscriptions;
}

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

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ai_model_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIModelComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 2000)
    private String content;
    
    @Column(name = "upvote_count")
    @Builder.Default
    private Integer upvoteCount = 0;
    
    @Column(name = "downvote_count")
    @Builder.Default
    private Integer downvoteCount = 0;
    
    @Column(name = "is_edited")
    @Builder.Default
    private Boolean isEdited = false;
    
    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_model_id", nullable = false)
    private AIModel aiModel;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private AIModelComment parentComment;
    
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AIModelComment> replies;
}

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_model_likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIModelLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_model_id", nullable = false)
    private AIModel aiModel;
    
    // Unique constraint to prevent duplicate likes
    @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "ai_model_id"})
    })
    public static class UniqueConstraint {}
}

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_model_ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIModelRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer rating; // 1-5 stars
    
    @Column(length = 1000)
    private String review;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_model_id", nullable = false)
    private AIModel aiModel;
    
    // Unique constraint to ensure one rating per user per model
    @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "ai_model_id"})
    })
    public static class UniqueConstraint {}
}

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    
    @Column(nullable = false, unique = true, length = 60)
    private String slug;
    
    @Column(length = 200)
    private String description;
    
    @Column(length = 7) // For hex color codes like #FF5733
    private String color;
    
    @Column(name = "usage_count")
    @Builder.Default
    private Integer usageCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private List<AIModel> aiModels;
}

package com.toolsai.server.model;

import com.toolsai.server.model.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_organization_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOrganizationSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;
    
    @Column(name = "subscribed_at")
    private LocalDateTime subscribedAt;
    
    @Column(name = "unsubscribed_at")
    private LocalDateTime unsubscribedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    // Unique constraint to prevent duplicate subscriptions
    @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "organization_id"})
    })
    public static class UniqueConstraint {}
}

package com.toolsai.server.model;

import com.toolsai.server.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;
    
    @Column(name = "action_url")
    private String actionUrl;
    
    @Column(columnDefinition = "TEXT") // For JSON data
    private String data;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender; // Can be null for system notifications
}

package com.toolsai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "key_name", nullable = false, length = 100)
    private String keyName;
    
    @Column(name = "key_hash", nullable = false, unique = true)
    private String keyHash; // Store hashed version of the key
    
    @Column(name = "key_prefix", nullable = false, length = 10)
    private String keyPrefix; // First few characters for identification
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "usage_count")
    @Builder.Default
    private Long usageCount = 0L;
    
    @Column(name = "rate_limit_per_hour")
    private Integer rateLimitPerHour;
    
    @Column(name = "allowed_origins", length = 1000)
    private String allowedOrigins; // Comma-separated list
    
    @Column(length = 500)
    private String description;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}