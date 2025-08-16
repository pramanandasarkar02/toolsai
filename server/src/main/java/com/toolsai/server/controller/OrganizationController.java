package com.toolsai.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toolsai.server.dto.request.CreateOrganizationRequest;
import com.toolsai.server.dto.response.OrganizationResponse;
import com.toolsai.server.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
@Slf4j
public class OrganizationController {
    private  final OrganizationService organizationService;


    @PostMapping
    public ResponseEntity<?> createOrganization(@Valid @RequestBody CreateOrganizationRequest request) {
        try {
            log.info("Received request: {}", new ObjectMapper().writeValueAsString(request));
            log.info("Creating organization: {}", request.getOrgName());
            OrganizationResponse organizationResponse = organizationService.createOrganization(request);
            return ResponseEntity.ok(organizationResponse);
        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Internal server error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @GetMapping
    public ResponseEntity<List<OrganizationResponse>> getAllOrganizations() {
        List<OrganizationResponse> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizationResponse> getOrganizationById(Long id) {
        OrganizationResponse organizationResponse = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(organizationResponse);
    }

}
