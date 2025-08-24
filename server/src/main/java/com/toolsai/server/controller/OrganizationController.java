package com.toolsai.server.controller;

import com.toolsai.server.dto.request.OrganizationCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @Valid @RequestBody OrganizationCreateRequest request) {
        OrganizationResponse organization = organizationService.createOrganization(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organization created successfully", organization));
    }

    @GetMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationById(@PathVariable Long organizationId) {
        OrganizationResponse organization = organizationService.getOrganizationById(organizationId);
        return ResponseEntity.ok(ApiResponse.success(organization));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationBySlug(@PathVariable String slug) {
        OrganizationResponse organization = organizationService.getOrganizationBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(organization));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrganizationResponse>>> getAllOrganizations(Pageable pageable) {
        Page<OrganizationResponse> organizations = organizationService.getAllOrganizations(pageable);
        return ResponseEntity.ok(ApiResponse.success(organizations));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<OrganizationResponse>>> searchOrganizations(
            @RequestParam String query, Pageable pageable) {
        Page<OrganizationResponse> organizations = organizationService.searchOrganizations(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(organizations));
    }

    @PutMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long organizationId,
            @Valid @RequestBody OrganizationCreateRequest request) {
        OrganizationResponse organization = organizationService.updateOrganization(organizationId, request);
        return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", organization));
    }

    @DeleteMapping("/{organizationId}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable Long organizationId) {
        organizationService.deleteOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Organization deleted successfully", null));
    }
}