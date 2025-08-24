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