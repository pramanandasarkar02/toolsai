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