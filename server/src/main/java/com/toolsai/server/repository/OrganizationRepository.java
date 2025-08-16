package com.toolsai.server.repository;

import com.toolsai.server.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByOrgName(String orgName);

    Optional<Organization> findByOrgUrl(String orgUrl);

    boolean existsByOrgName(String orgName);

    boolean existsByOrgUrl(String orgUrl);
}