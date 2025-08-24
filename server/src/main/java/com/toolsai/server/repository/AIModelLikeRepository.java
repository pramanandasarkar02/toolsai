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