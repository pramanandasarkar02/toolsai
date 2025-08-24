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