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

