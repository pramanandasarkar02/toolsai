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