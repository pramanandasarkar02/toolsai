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