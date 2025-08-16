package com.toolsai.server.service;

import com.toolsai.server.dto.request.CreateOrganizationRequest;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.model.Organization;
import com.toolsai.server.repository.OrganizationRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
@Validated
public class OrganizationService {
    private final OrganizationRepository organizationRepository;

    public OrganizationResponse createOrganization(@Valid CreateOrganizationRequest request) {
        log.info("Creating organization with name: {}", request.getOrgName());

        // Check for duplicate organization name
        if (organizationRepository.existsByOrgName(request.getOrgName())) {
            throw new IllegalArgumentException("Organization name already exists");
        }

        // Check for duplicate organization URL
        if (organizationRepository.existsByOrgUrl(request.getOrgUrl())) {
            throw new IllegalArgumentException("Organization URL already exists");
        }

        // Map request to entity
        Organization organization = Organization.builder()
                .orgName(request.getOrgName())
                .orgUrl(request.getOrgUrl())
                .description(request.getDescription())
                .orgSecret(request.getOrgSecret()) // Include orgSecret
                .isActive(true)
                .joinedAt(LocalDateTime.now())
                .build();

        // Persist the entity
        Organization savedOrganization = organizationRepository.save(organization);
        log.info("Organization created successfully with ID: {}", savedOrganization.getId());

        // Map to response DTO
        return new OrganizationResponse(savedOrganization);
    }

    public List<OrganizationResponse> getAllOrganizations() {
        log.info("Fetching all organizations");
        return organizationRepository.findAll()
                .stream()
                .map(OrganizationResponse::new)
                .collect(Collectors.toList());
    }

    public OrganizationResponse getOrganizationById(Long id) {
        log.info("Fetching organization with ID: {}", id);
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found with ID: " + id));
        return new OrganizationResponse(organization);
    }
}