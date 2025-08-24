// ============= REPOSITORIES =============

package com.toolsai.server.repository;

import com.toolsai.server.model.User;
import com.toolsai.server.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
Optional<User> findByEmail(String email);
Optional<User> findByUsername(String username);
Optional<User> findByVerificationToken(String token);
Optional<User> findByResetPasswordToken(String token);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    
    List<User> findByRole(Role role);
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :date")
    List<User> findRecentUsers(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
}

package com.toolsai.server.repository;

import com.toolsai.server.model.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
Optional<Organization> findByOrgName(String orgName);
Optional<Organization> findByOrgSlug(String orgSlug);
Optional<Organization> findByOrgUrl(String orgUrl);

    boolean existsByOrgName(String orgName);
    boolean existsByOrgSlug(String orgSlug);
    boolean existsByOrgUrl(String orgUrl);
    
    Page<Organization> findByIsActive(boolean isActive, Pageable pageable);
    List<Organization> findByIsVerified(boolean isVerified);
    
    @Query("SELECT o FROM Organization o WHERE o.orgName LIKE %:name% OR o.description LIKE %:description%")
    Page<Organization> searchByNameOrDescription(@Param("name") String name, 
                                               @Param("description") String description, 
                                               Pageable pageable);
    
    @Query("SELECT o FROM Organization o ORDER BY o.totalSubscribers DESC")
    List<Organization> findTopOrganizationsBySubscribers(Pageable pageable);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.Organization;
import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.model.enums.PricingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AIModelRepository extends JpaRepository<AIModel, Long> {
Optional<AIModel> findByModelSlug(String modelSlug);

    List<AIModel> findByOrganization(Organization organization);
    Page<AIModel> findByOrganizationAndModelStatus(Organization organization, ModelStatus status, Pageable pageable);
    
    Page<AIModel> findByModelCategory(ModelCategory category, Pageable pageable);
    Page<AIModel> findByPricingType(PricingType pricingType, Pageable pageable);
    Page<AIModel> findByModelStatus(ModelStatus status, Pageable pageable);
    Page<AIModel> findByIsFeatured(boolean isFeatured, Pageable pageable);
    
    @Query("SELECT m FROM AIModel m WHERE m.modelName LIKE %:query% OR m.modelDescription LIKE %:query%")
    Page<AIModel> searchModels(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT m FROM AIModel m WHERE m.modelPrice BETWEEN :minPrice AND :maxPrice")
    Page<AIModel> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                  @Param("maxPrice") BigDecimal maxPrice, 
                                  Pageable pageable);
    
    @Query("SELECT m FROM AIModel m ORDER BY m.viewCount DESC")
    List<AIModel> findMostViewedModels(Pageable pageable);
    
    @Query("SELECT m FROM AIModel m ORDER BY m.likeCount DESC")
    List<AIModel> findMostLikedModels(Pageable pageable);
    
    @Query("SELECT m FROM AIModel m ORDER BY m.averageRating DESC NULLS LAST")
    List<AIModel> findTopRatedModels(Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM AIModel m WHERE m.organization = :organization AND m.modelStatus = 'ACTIVE'")
    long countActiveModelsByOrganization(@Param("organization") Organization organization);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelComment;
import com.toolsai.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIModelCommentRepository extends JpaRepository<AIModelComment, Long> {
Page<AIModelComment> findByAiModelAndIsDeleted(AIModel aiModel, boolean isDeleted, Pageable pageable);
Page<AIModelComment> findByUserAndIsDeleted(User user, boolean isDeleted, Pageable pageable);
List<AIModelComment> findByParentCommentAndIsDeleted(AIModelComment parentComment, boolean isDeleted);

    @Query("SELECT c FROM AIModelComment c WHERE c.aiModel = :aiModel AND c.parentComment IS NULL AND c.isDeleted = false")
    Page<AIModelComment> findTopLevelCommentsByModel(@Param("aiModel") AIModel aiModel, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM AIModelComment c WHERE c.aiModel = :aiModel AND c.isDeleted = false")
    long countByAiModelAndNotDeleted(@Param("aiModel") AIModel aiModel);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelLike;
import com.toolsai.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIModelLikeRepository extends JpaRepository<AIModelLike, Long> {
Optional<AIModelLike> findByUserAndAiModel(User user, AIModel aiModel);
boolean existsByUserAndAiModel(User user, AIModel aiModel);

    @Query("SELECT COUNT(l) FROM AIModelLike l WHERE l.aiModel = :aiModel")
    long countByAiModel(@Param("aiModel") AIModel aiModel);
    
    void deleteByUserAndAiModel(User user, AIModel aiModel);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelRating;
import com.toolsai.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AIModelRatingRepository extends JpaRepository<AIModelRating, Long> {
Optional<AIModelRating> findByUserAndAiModel(User user, AIModel aiModel);
Page<AIModelRating> findByAiModel(AIModel aiModel, Pageable pageable);
Page<AIModelRating> findByUser(User user, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM AIModelRating r WHERE r.aiModel = :aiModel")
    BigDecimal findAverageRatingByAiModel(@Param("aiModel") AIModel aiModel);
    
    @Query("SELECT COUNT(r) FROM AIModelRating r WHERE r.aiModel = :aiModel")
    long countByAiModel(@Param("aiModel") AIModel aiModel);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
Optional<Tag> findByName(String name);
Optional<Tag> findBySlug(String slug);

    boolean existsByName(String name);
    boolean existsBySlug(String slug);
    
    @Query("SELECT t FROM Tag t ORDER BY t.usageCount DESC")
    List<Tag> findMostUsedTags(Pageable pageable);
    
    @Query("SELECT t FROM Tag t WHERE t.name LIKE %:query%")
    Page<Tag> searchTags(@Param("query") String query, Pageable pageable);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.Organization;
import com.toolsai.server.model.User;
import com.toolsai.server.model.UserOrganizationSubscription;
import com.toolsai.server.model.enums.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserOrganizationSubscriptionRepository extends JpaRepository<UserOrganizationSubscription, Long> {
Optional<UserOrganizationSubscription> findByUserAndOrganization(User user, Organization organization);
List<UserOrganizationSubscription> findByUserAndStatus(User user, SubscriptionStatus status);
List<UserOrganizationSubscription> findByOrganizationAndStatus(Organization organization, SubscriptionStatus status);

    Page<UserOrganizationSubscription> findByUser(User user, Pageable pageable);
    Page<UserOrganizationSubscription> findByOrganization(Organization organization, Pageable pageable);
    
    boolean existsByUserAndOrganization(User user, Organization organization);
    
    @Query("SELECT COUNT(s) FROM UserOrganizationSubscription s WHERE s.organization = :organization AND s.status = 'ACTIVE'")
    long countActiveSubscriptionsByOrganization(@Param("organization") Organization organization);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.Notification;
import com.toolsai.server.model.User;
import com.toolsai.server.model.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
Page<Notification> findByReceiver(User receiver, Pageable pageable);
Page<Notification> findByReceiverAndIsRead(User receiver, boolean isRead, Pageable pageable);
Page<Notification> findByReceiverAndType(User receiver, NotificationType type, Pageable pageable);

    List<Notification> findBySender(User sender);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.receiver = :receiver AND n.isRead = false")
    long countUnreadNotificationsByReceiver(@Param("receiver") User receiver);
}

package com.toolsai.server.repository;

import com.toolsai.server.model.ApiKey;
import com.toolsai.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
Optional<ApiKey> findByKeyHash(String keyHash);
List<ApiKey> findByUser(User user);
List<ApiKey> findByUserAndIsActive(User user, boolean isActive);

    @Query("SELECT a FROM ApiKey a WHERE a.expiresAt < :now AND a.isActive = true")
    List<ApiKey> findExpiredKeys(@Param("now") LocalDateTime now);
    
    boolean existsByKeyHash(String keyHash);
}

// ============= DTOs =============

package com.toolsai.server.dto.request;

import com.toolsai.server.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRegistrationRequest {
@NotBlank(message = "Username is required")
@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;
    
    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;
}

package com.toolsai.server.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {
@NotBlank(message = "Email is required")
@Email(message = "Email must be valid")
private String email;

    @NotBlank(message = "Password is required")
    private String password;
}

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

package com.toolsai.server.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CommentCreateRequest {
@NotBlank(message = "Comment content is required")
@Size(max = 2000, message = "Comment cannot exceed 2000 characters")
private String content;

    private Long parentCommentId;
}

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

package com.toolsai.server.dto.response;

import com.toolsai.server.model.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
private Long id;
private String username;
private String email;
private String fullName;
private String bio;
private String avatarUrl;
private Role role;
private Boolean isActive;
private Boolean isVerified;
private LocalDateTime lastLoginAt;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
}

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

package com.toolsai.server.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
private Long id;
private String content;
private Integer upvoteCount;
private Integer downvoteCount;
private Boolean isEdited;
private Boolean isDeleted;
private UserResponse user;
private Long parentCommentId;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
}

package com.toolsai.server.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RatingResponse {
private Long id;
private Integer rating;
private String review;
private UserResponse user;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
}

package com.toolsai.server.dto.response;

import lombok.Data;

@Data
public class TagResponse {
private Long id;
private String name;
private String slug;
private String description;
private String color;
private Integer usageCount;
}

package com.toolsai.server.dto.response;

import lombok.Data;

@Data
public class ApiResponse<T> {
private boolean success;
private String message;
private T data;
private String timestamp;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Operation successful");
        response.setData(data);
        response.setTimestamp(java.time.LocalDateTime.now().toString());
        return response;
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(java.time.LocalDateTime.now().toString());
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setTimestamp(java.time.LocalDateTime.now().toString());
        return response;
    }
}

// ============= SERVICES =============

package com.toolsai.server.service;

import com.toolsai.server.dto.request.UserLoginRequest;
import com.toolsai.server.dto.request.UserRegistrationRequest;
import com.toolsai.server.dto.response.UserResponse;
import com.toolsai.server.exception.ResourceAlreadyExistsException;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .bio(request.getBio())
                .verificationToken(UUID.randomUUID().toString())
                .build();
        
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }
    
    public UserResponse authenticateUser(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }
        
        if (!user.getIsActive()) {
            throw new IllegalStateException("User account is disabled");
        }
        
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        return convertToResponse(user);
    }
    
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToResponse(user);
    }
    
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToResponse(user);
    }
    
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional
    public UserResponse updateUser(Long userId, UserRegistrationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    @Transactional
    public UserResponse verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));
        
        user.setIsVerified(true);
        user.setVerificationToken(null);
        
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }
    
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        BeanUtils.copyProperties(user, response);
        return response;
    }
}

package com.toolsai.server.service;

import com.toolsai.server.dto.request.OrganizationCreateRequest;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.exception.ResourceAlreadyExistsException;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.Organization;
import com.toolsai.server.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    
    @Transactional
    public OrganizationResponse createOrganization(OrganizationCreateRequest request) {
        if (organizationRepository.existsByOrgName(request.getOrgName())) {
            throw new ResourceAlreadyExistsException("Organization name already exists");
        }
        
        if (request.getOrgSlug() != null && organizationRepository.existsByOrgSlug(request.getOrgSlug())) {
            throw new ResourceAlreadyExistsException("Organization slug already exists");
        }
        
        if (organizationRepository.existsByOrgUrl(request.getOrgUrl())) {
            throw new ResourceAlreadyExistsException("Organization URL already exists");
        }
        
        Organization organization = Organization.builder()
                .orgName(request.getOrgName())
                .orgSlug(request.getOrgSlug())
                .orgUrl(request.getOrgUrl())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .orgSecret(UUID.randomUUID().toString())
                .joinedAt(LocalDateTime.now())
                .build();
        
        Organization savedOrganization = organizationRepository.save(organization);
        return convertToResponse(savedOrganization);
    }
    
    public OrganizationResponse getOrganizationById(Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return convertToResponse(organization);
    }
    
    public OrganizationResponse getOrganizationBySlug(String slug) {
        Organization organization = organizationRepository.findByOrgSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return convertToResponse(organization);
    }
    
    public Page<OrganizationResponse> getAllOrganizations(Pageable pageable) {
        return organizationRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    public Page<OrganizationResponse> searchOrganizations(String query, Pageable pageable) {
        return organizationRepository.searchByNameOrDescription(query, query, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional
    public OrganizationResponse updateOrganization(Long organizationId, OrganizationCreateRequest request) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        
        organization.setDescription(request.getDescription());
        organization.setLogoUrl(request.getLogoUrl());
        
        Organization savedOrganization = organizationRepository.save(organization);
        return convertToResponse(savedOrganization);
    }
    
    @Transactional
    public void deleteOrganization(Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        organization.setIsActive(false);
        organizationRepository.save(organization);
    }
    
    private OrganizationResponse convertToResponse(Organization organization) {
        OrganizationResponse response = new OrganizationResponse();
        BeanUtils.copyProperties(organization, response);
        return response;
    }
}

package com.toolsai.server.service;

import com.toolsai.server.dto.request.AIModelCreateRequest;
import com.toolsai.server.dto.response.AIModelResponse;
import com.toolsai.server.exception.ResourceAlreadyExistsException;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.Organization;
import com.toolsai.server.model.Tag;
import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.OrganizationRepository;
import com.toolsai.server.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIModelService {

    private final AIModelRepository aiModelRepository;
    private final OrganizationRepository organizationRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;
    
    @Transactional
    public AIModelResponse createAIModel(AIModelCreateRequest request) {
        if (aiModelRepository.findByModelSlug(request.getModelSlug()).isPresent()) {
            throw new ResourceAlreadyExistsException("Model slug already exists");
        }
        
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        
        AIModel aiModel = AIModel.builder()
                .modelName(request.getModelName())
                .modelSlug(request.getModelSlug())
                .modelDescription(request.getModelDescription())
                .modelVersion(request.getModelVersion())
                .modelCategory(request.getModelCategory())
                .pricingType(request.getPricingType())
                .modelPrice(request.getModelPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .pricingUnit(request.getPricingUnit())
                .apiUrl(request.getApiUrl())
                .documentationUrl(request.getDocumentationUrl())
                .modelImageUrl(request.getModelImageUrl())
                .organization(organization)
                .build();
        
        // Handle tags
        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            List<Tag> tags = request.getTagNames().stream()
                    .map(tagService::getOrCreateTag)
                    .collect(Collectors.toList());
            aiModel.setTags(tags);
        }
        
        AIModel savedModel = aiModelRepository.save(aiModel);
        
        // Update organization total models count
        organization.setTotalModels(organization.getTotalModels() + 1);
        organizationRepository.save(organization);
        
        return convertToResponse(savedModel);
    }
    
    public AIModelResponse getAIModelById(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        // Increment view count
        aiModel.setViewCount(aiModel.getViewCount() + 1);
        aiModelRepository.save(aiModel);
        
        return convertToResponse(aiModel);
    }
    
    public AIModelResponse getAIModelBySlug(String slug) {
        AIModel aiModel = aiModelRepository.findByModelSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        // Increment view count
        aiModel.setViewCount(aiModel.getViewCount() + 1);
        aiModelRepository.save(aiModel);
        
        return convertToResponse(aiModel);
    }
    
    public Page<AIModelResponse> getAllAIModels(Pageable pageable) {
        return aiModelRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    public Page<AIModelResponse> getAIModelsByCategory(ModelCategory category, Pageable pageable) {
        return aiModelRepository.findByModelCategory(category, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<AIModelResponse> getAIModelsByStatus(ModelStatus status, Pageable pageable) {
        return aiModelRepository.findByModelStatus(status, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<AIModelResponse> getFeaturedAIModels(Pageable pageable) {
        return aiModelRepository.findByIsFeatured(true, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<AIModelResponse> searchAIModels(String query, Pageable pageable) {
        return aiModelRepository.searchModels(query, pageable)
                .map(this::convertToResponse);
    }
    
    public List<AIModelResponse> getMostViewedModels(int limit) {
        return aiModelRepository.findMostViewedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<AIModelResponse> getMostLikedModels(int limit) {
        return aiModelRepository.findMostLikedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<AIModelResponse> getTopRatedModels(int limit) {
        return aiModelRepository.findTopRatedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AIModelResponse updateAIModel(Long modelId, AIModelCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        aiModel.setModelDescription(request.getModelDescription());
        aiModel.setModelVersion(request.getModelVersion());
        aiModel.setModelCategory(request.getModelCategory());
        aiModel.setPricingType(request.getPricingType());
        aiModel.setModelPrice(request.getModelPrice());
        aiModel.setCurrency(request.getCurrency());
        aiModel.setPricingUnit(request.getPricingUnit());
        aiModel.setApiUrl(request.getApiUrl());
        aiModel.setDocumentationUrl(request.getDocumentationUrl());
        aiModel.setModelImageUrl(request.getModelImageUrl());
        
        AIModel savedModel = aiModelRepository.save(aiModel);
        return convertToResponse(savedModel);
    }
    
    @Transactional
    public void deleteAIModel(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        aiModel.setModelStatus(ModelStatus.INACTIVE);
        aiModelRepository.save(aiModel);
    }
    
    private AIModelResponse convertToResponse(AIModel aiModel) {
        AIModelResponse response = new AIModelResponse();
        BeanUtils.copyProperties(aiModel, response);
        // Handle nested objects conversion here if needed
        return response;
    }
}

package com.toolsai.server.service;

import com.toolsai.server.dto.request.CommentCreateRequest;
import com.toolsai.server.dto.response.CommentResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelComment;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelCommentRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final AIModelCommentRepository commentRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public CommentResponse createComment(Long modelId, Long userId, CommentCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        AIModelComment comment = AIModelComment.builder()
                .content(request.getContent())
                .user(user)
                .aiModel(aiModel)
                .build();
        
        // Handle parent comment if provided
        if (request.getParentCommentId() != null) {
            AIModelComment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }
        
        AIModelComment savedComment = commentRepository.save(comment);
        
        // Update model comment count
        aiModel.setCommentCount(aiModel.getCommentCount() + 1);
        aiModelRepository.save(aiModel);
        
        return convertToResponse(savedComment);
    }
    
    public Page<CommentResponse> getCommentsByModel(Long modelId, Pageable pageable) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        return commentRepository.findTopLevelCommentsByModel(aiModel, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<CommentResponse> getCommentsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return commentRepository.findByUserAndIsDeleted(user, false, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional
    public CommentResponse updateComment(Long commentId, Long userId, CommentCreateRequest request) {
        AIModelComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only edit your own comments");
        }
        
        comment.setContent(request.getContent());
        comment.setIsEdited(true);
        
        AIModelComment savedComment = commentRepository.save(comment);
        return convertToResponse(savedComment);
    }
    
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        AIModelComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own comments");
        }
        
        comment.setIsDeleted(true);
        commentRepository.save(comment);
        
        // Update model comment count
        AIModel aiModel = comment.getAiModel();
        aiModel.setCommentCount(aiModel.getCommentCount() - 1);
        aiModelRepository.save(aiModel);
    }
    
    private CommentResponse convertToResponse(AIModelComment comment) {
        CommentResponse response = new CommentResponse();
        BeanUtils.copyProperties(comment, response);
        if (comment.getParentComment() != null) {
            response.setParentCommentId(comment.getParentComment().getId());
        }
        return response;
    }
}

package com.toolsai.server.service;

import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelLike;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelLikeRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final AIModelLikeRepository likeRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public boolean toggleLike(Long modelId, Long userId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (likeRepository.existsByUserAndAiModel(user, aiModel)) {
            likeRepository.deleteByUserAndAiModel(user, aiModel);
            aiModel.setLikeCount(aiModel.getLikeCount() - 1);
            aiModelRepository.save(aiModel);
            return false; // Like removed
        } else {
            AIModelLike like = AIModelLike.builder()
                    .user(user)
                    .aiModel(aiModel)
                    .build();
            likeRepository.save(like);
            
            aiModel.setLikeCount(aiModel.getLikeCount() + 1);
            aiModelRepository.save(aiModel);
            return true; // Like added
        }
    }
    
    public boolean isLikedByUser(Long modelId, Long userId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return likeRepository.existsByUserAndAiModel(user, aiModel);
    }
    
    public long getLikeCount(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        return likeRepository.countByAiModel(aiModel);
    }
}

package com.toolsai.server.service;

import com.toolsai.server.dto.request.RatingCreateRequest;
import com.toolsai.server.dto.response.RatingResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelRating;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelRatingRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final AIModelRatingRepository ratingRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public RatingResponse createOrUpdateRating(Long modelId, Long userId, RatingCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Optional<AIModelRating> existingRating = ratingRepository.findByUserAndAiModel(user, aiModel);
        
        AIModelRating rating;
        if (existingRating.isPresent()) {
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setReview(request.getReview());
        } else {
            rating = AIModelRating.builder()
                    .rating(request.getRating())
                    .review(request.getReview())
                    .user(user)
                    .aiModel(aiModel)
                    .build();
        }
        
        AIModelRating savedRating = ratingRepository.save(rating);
        
        // Update model rating statistics
        updateModelRatingStatistics(aiModel);
        
        return convertToResponse(savedRating);
    }
    
    public Page<RatingResponse> getRatingsByModel(Long modelId, Pageable pageable) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        
        return ratingRepository.findByAiModel(aiModel, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<RatingResponse> getRatingsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return ratingRepository.findByUser(user, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        AIModelRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));
        
        if (!rating.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own ratings");
        }
        
        AIModel aiModel = rating.getAiModel();
        ratingRepository.delete(rating);
        
        // Update model rating statistics
        updateModelRatingStatistics(aiModel);
    }
    
    private void updateModelRatingStatistics(AIModel aiModel) {
        long ratingCount = ratingRepository.countByAiModel(aiModel);
        BigDecimal averageRating = ratingRepository.findAverageRatingByAiModel(aiModel);
        
        aiModel.setRatingCount((int) ratingCount);
        aiModel.setAverageRating(averageRating != null ? 
                averageRating.setScale(2, RoundingMode.HALF_UP) : null);
        
        aiModelRepository.save(aiModel);
    }
    
    private RatingResponse convertToResponse(AIModelRating rating) {
        RatingResponse response = new RatingResponse();
        BeanUtils.copyProperties(rating, response);
        return response;
    }
}

package com.toolsai.server.service;

import com.toolsai.server.dto.response.TagResponse;
import com.toolsai.server.model.Tag;
import com.toolsai.server.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    
    @Transactional
    public Tag getOrCreateTag(String tagName) {
        return tagRepository.findByName(tagName.toLowerCase())
                .orElseGet(() -> {
                    Tag tag = Tag.builder()
                            .name(tagName.toLowerCase())
                            .slug(tagName.toLowerCase().replaceAll("[^a-z0-9]", "-"))
                            .build();
                    return tagRepository.save(tag);
                });
    }
    
    public Page<TagResponse> getAllTags(Pageable pageable) {
        return tagRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    public List<TagResponse> getMostUsedTags(int limit) {
        return tagRepository.findMostUsedTags(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<TagResponse> searchTags(String query, Pageable pageable) {
        return tagRepository.searchTags(query, pageable)
                .map(this::convertToResponse);
    }
    
    private TagResponse convertToResponse(Tag tag) {
        TagResponse response = new TagResponse();
        BeanUtils.copyProperties(tag, response);
        return response;
    }
}

// ============= CONTROLLERS =============

package com.toolsai.server.controller;

import com.toolsai.server.dto.request.UserLoginRequest;
import com.toolsai.server.dto.request.UserRegistrationRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.UserResponse;
import com.toolsai.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse user = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> loginUser(@Valid @RequestBody UserLoginRequest request) {
        UserResponse user = userService.authenticateUser(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", user));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByUsername(@PathVariable String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserRegistrationRequest request) {
        UserResponse user = userService.updateUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", user));
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<UserResponse>> verifyUser(@RequestParam String token) {
        UserResponse user = userService.verifyUser(token);
        return ResponseEntity.ok(ApiResponse.success("User verified successfully", user));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.request.OrganizationCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @Valid @RequestBody OrganizationCreateRequest request) {
        OrganizationResponse organization = organizationService.createOrganization(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organization created successfully", organization));
    }
    
    @GetMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationById(@PathVariable Long organizationId) {
        OrganizationResponse organization = organizationService.getOrganizationById(organizationId);
        return ResponseEntity.ok(ApiResponse.success(organization));
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationBySlug(@PathVariable String slug) {
        OrganizationResponse organization = organizationService.getOrganizationBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(organization));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrganizationResponse>>> getAllOrganizations(Pageable pageable) {
        Page<OrganizationResponse> organizations = organizationService.getAllOrganizations(pageable);
        return ResponseEntity.ok(ApiResponse.success(organizations));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<OrganizationResponse>>> searchOrganizations(
            @RequestParam String query, Pageable pageable) {
        Page<OrganizationResponse> organizations = organizationService.searchOrganizations(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(organizations));
    }
    
    @PutMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long organizationId,
            @Valid @RequestBody OrganizationCreateRequest request) {
        OrganizationResponse organization = organizationService.updateOrganization(organizationId, request);
        return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", organization));
    }
    
    @DeleteMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable Long organizationId) {
        organizationService.deleteOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Organization deleted successfully", null));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.request.AIModelCreateRequest;
import com.toolsai.server.dto.response.AIModelResponse;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.service.AIModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class AIModelController {

    private final AIModelService aiModelService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<AIModelResponse>> createAIModel(
            @Valid @RequestBody AIModelCreateRequest request) {
        AIModelResponse model = aiModelService.createAIModel(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AI Model created successfully", model));
    }
    
    @GetMapping("/{modelId}")
    public ResponseEntity<ApiResponse<AIModelResponse>> getAIModelById(@PathVariable Long modelId) {
        AIModelResponse model = aiModelService.getAIModelById(modelId);
        return ResponseEntity.ok(ApiResponse.success(model));
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<AIModelResponse>> getAIModelBySlug(@PathVariable String slug) {
        AIModelResponse model = aiModelService.getAIModelBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(model));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAllAIModels(Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAllAIModels(pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAIModelsByCategory(
            @PathVariable ModelCategory category, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAIModelsByCategory(category, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAIModelsByStatus(
            @PathVariable ModelStatus status, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAIModelsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getFeaturedAIModels(Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getFeaturedAIModels(pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> searchAIModels(
            @RequestParam String query, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.searchAIModels(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/trending/most-viewed")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getMostViewedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getMostViewedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/trending/most-liked")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getMostLikedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getMostLikedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/trending/top-rated")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getTopRatedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getTopRatedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @PutMapping("/{modelId}")
    public ResponseEntity<ApiResponse<AIModelResponse>> updateAIModel(
            @PathVariable Long modelId,
            @Valid @RequestBody AIModelCreateRequest request) {
        AIModelResponse model = aiModelService.updateAIModel(modelId, request);
        return ResponseEntity.ok(ApiResponse.success("AI Model updated successfully", model));
    }
    
    @DeleteMapping("/{modelId}")
    public ResponseEntity<ApiResponse<Void>> deleteAIModel(@PathVariable Long modelId) {
        aiModelService.deleteAIModel(modelId);
        return ResponseEntity.ok(ApiResponse.success("AI Model deleted successfully", null));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.request.CommentCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.CommentResponse;
import com.toolsai.server.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long modelId,
            @RequestParam Long userId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse comment = commentService.createComment(modelId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", comment));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsByModel(
            @PathVariable Long modelId, Pageable pageable) {
        Page<CommentResponse> comments = commentService.getCommentsByModel(modelId, pageable);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long modelId,
            @PathVariable Long commentId,
            @RequestParam Long userId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse comment = commentService.updateComment(commentId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long modelId,
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}

@RestController
@RequestMapping("/api/users/{userId}/comments")
@RequiredArgsConstructor
public class UserCommentController {

    private final CommentService commentService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsByUser(
            @PathVariable Long userId, Pageable pageable) {
        Page<CommentResponse> comments = commentService.getCommentsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    
    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<Boolean>> toggleLike(
            @PathVariable Long modelId,
            @RequestParam Long userId) {
        boolean liked = likeService.toggleLike(modelId, userId);
        String message = liked ? "Model liked successfully" : "Like removed successfully";
        return ResponseEntity.ok(ApiResponse.success(message, liked));
    }
    
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkLike(
            @PathVariable Long modelId,
            @RequestParam Long userId) {
        boolean liked = likeService.isLikedByUser(modelId, userId);
        return ResponseEntity.ok(ApiResponse.success(liked));
    }
    
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getLikeCount(@PathVariable Long modelId) {
        long count = likeService.getLikeCount(modelId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.request.RatingCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.RatingResponse;
import com.toolsai.server.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> createOrUpdateRating(
            @PathVariable Long modelId,
            @RequestParam Long userId,
            @Valid @RequestBody RatingCreateRequest request) {
        RatingResponse rating = ratingService.createOrUpdateRating(modelId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Rating saved successfully", rating));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getRatingsByModel(
            @PathVariable Long modelId, Pageable pageable) {
        Page<RatingResponse> ratings = ratingService.getRatingsByModel(modelId, pageable);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }
    
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @PathVariable Long modelId,
            @PathVariable Long ratingId,
            @RequestParam Long userId) {
        ratingService.deleteRating(ratingId, userId);
        return ResponseEntity.ok(ApiResponse.success("Rating deleted successfully", null));
    }
}

@RestController
@RequestMapping("/api/users/{userId}/ratings")
@RequiredArgsConstructor
public class UserRatingController {

    private final RatingService ratingService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getRatingsByUser(
            @PathVariable Long userId, Pageable pageable) {
        Page<RatingResponse> ratings = ratingService.getRatingsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.TagResponse;
import com.toolsai.server.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TagResponse>>> getAllTags(Pageable pageable) {
        Page<TagResponse> tags = tagService.getAllTags(pageable);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<TagResponse>>> getMostUsedTags(
            @RequestParam(defaultValue = "20") int limit) {
        List<TagResponse> tags = tagService.getMostUsedTags(limit);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TagResponse>>> searchTags(
            @RequestParam String query, Pageable pageable) {
        Page<TagResponse> tags = tagService.searchTags(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
}

// ============= EXCEPTION HANDLING =============

package com.toolsai.server.exception;

public class ResourceNotFoundException extends RuntimeException {
public ResourceNotFoundException(String message) {
super(message);
}
}

package com.toolsai.server.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
public ResourceAlreadyExistsException(String message) {
super(message);
}
}

package com.toolsai.server.exception;

import com.toolsai.server.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex) {
        log.error("Resource already exists: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalStateException(IllegalStateException ex) {
        log.error("Illegal state: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.error("Validation failed: {}", errors);
        ApiResponse<Map<String, String>> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage("Validation failed");
        response.setData(errors);
        response.setTimestamp(java.time.LocalDateTime.now().toString());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }
}

// ============= ADDITIONAL SERVICES =============

package com.toolsai.server.service;

import com.toolsai.server.dto.response.NotificationResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.Notification;
import com.toolsai.server.model.User;
import com.toolsai.server.model.enums.NotificationType;
import com.toolsai.server.repository.NotificationRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public NotificationResponse createNotification(Long receiverId, String title, String message, 
                                                 NotificationType type, Long senderId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));
        
        User sender = null;
        if (senderId != null) {
            sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        }
        
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .receiver(receiver)
                .sender(sender)
                .build();
        
        Notification savedNotification = notificationRepository.save(notification);
        return convertToResponse(savedNotification);
    }
    
    public Page<NotificationResponse> getNotificationsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return notificationRepository.findByReceiver(user, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<NotificationResponse> getUnreadNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return notificationRepository.findByReceiverAndIsRead(user, false, pageable)
                .map(this::convertToResponse);
    }
    
    public long getUnreadNotificationCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return notificationRepository.countUnreadNotificationsByReceiver(user);
    }
    
    @Transactional
    public void markNotificationAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getReceiver().getId().equals(userId)) {
            throw new IllegalStateException("You can only mark your own notifications as read");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Page<Notification> unreadNotifications = notificationRepository.findByReceiverAndIsRead(
                user, false, Pageable.unpaged());
        
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    private NotificationResponse convertToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        BeanUtils.copyProperties(notification, response);
        return response;
    }
}

package com.toolsai.server.dto.response;

import com.toolsai.server.model.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
private Long id;
private String title;
private String message;
private NotificationType type;
private Boolean isRead;
private String actionUrl;
private String data;
private UserResponse sender;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
}

package com.toolsai.server.controller;

import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.NotificationResponse;
import com.toolsai.server.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotificationsByUser(
            @PathVariable Long userId, Pageable pageable) {
        Page<NotificationResponse> notifications = notificationService.getNotificationsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getUnreadNotifications(
            @PathVariable Long userId, Pageable pageable) {
        Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadNotificationCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
    
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationAsRead(
            @PathVariable Long userId,
            @PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsAsRead(@PathVariable Long userId) {
        notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}