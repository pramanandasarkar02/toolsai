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