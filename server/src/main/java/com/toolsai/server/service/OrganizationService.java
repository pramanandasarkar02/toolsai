package com.toolsai.server.service;

import com.toolsai.server.dto.request.OrganizationCreateRequest;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.exception.ResourceAlreadyExistsException;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.Organization;
import com.toolsai.server.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    @Transactional
    public OrganizationResponse createOrganization(OrganizationCreateRequest request) {
        if (organizationRepository.existsByOrgName(request.getOrgName())) {
            throw new ResourceAlreadyExistsException("Organization name already exists");
        }

        if (request.getOrgSlug() != null && organizationRepository.existsByOrgSlug(request.getOrgSlug())) {
            throw new ResourceAlreadyExistsException("Organization slug already exists");
        }

        if (organizationRepository.existsByOrgUrl(request.getOrgUrl())) {
            throw new ResourceAlreadyExistsException("Organization URL already exists");
        }

        Organization organization = Organization.builder()
                .orgName(request.getOrgName())
                .orgSlug(request.getOrgSlug())
                .orgUrl(request.getOrgUrl())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .orgSecret(UUID.randomUUID().toString())
                .joinedAt(LocalDateTime.now())
                .build();

        Organization savedOrganization = organizationRepository.save(organization);
        return convertToResponse(savedOrganization);
    }

    public OrganizationResponse getOrganizationById(Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return convertToResponse(organization);
    }

    public OrganizationResponse getOrganizationBySlug(String slug) {
        Organization organization = organizationRepository.findByOrgSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return convertToResponse(organization);
    }

    public Page<OrganizationResponse> getAllOrganizations(Pageable pageable) {
        return organizationRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public Page<OrganizationResponse> searchOrganizations(String query, Pageable pageable) {
        return organizationRepository.searchByNameOrDescription(query, query, pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public OrganizationResponse updateOrganization(Long organizationId, OrganizationCreateRequest request) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        organization.setDescription(request.getDescription());
        organization.setLogoUrl(request.getLogoUrl());

        Organization savedOrganization = organizationRepository.save(organization);
        return convertToResponse(savedOrganization);
    }

    @Transactional
    public void deleteOrganization(Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        organization.setIsActive(false);
        organizationRepository.save(organization);
    }

    private OrganizationResponse convertToResponse(Organization organization) {
        OrganizationResponse response = new OrganizationResponse();
        BeanUtils.copyProperties(organization, response);
        return response;
    }
}