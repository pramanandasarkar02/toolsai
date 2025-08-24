package com.toolsai.server.service;

import com.toolsai.server.dto.request.AIModelCreateRequest;
import com.toolsai.server.dto.response.AIModelResponse;
import com.toolsai.server.exception.ResourceAlreadyExistsException;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.Organization;
import com.toolsai.server.model.Tag;
import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.OrganizationRepository;
import com.toolsai.server.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIModelService {

    private final AIModelRepository aiModelRepository;
    private final OrganizationRepository organizationRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;

    @Transactional
    public AIModelResponse createAIModel(AIModelCreateRequest request) {
        if (aiModelRepository.findByModelSlug(request.getModelSlug()).isPresent()) {
            throw new ResourceAlreadyExistsException("Model slug already exists");
        }

        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        AIModel aiModel = AIModel.builder()
                .modelName(request.getModelName())
                .modelSlug(request.getModelSlug())
                .modelDescription(request.getModelDescription())
                .modelVersion(request.getModelVersion())
                .modelCategory(request.getModelCategory())
                .pricingType(request.getPricingType())
                .modelPrice(request.getModelPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .pricingUnit(request.getPricingUnit())
                .apiUrl(request.getApiUrl())
                .documentationUrl(request.getDocumentationUrl())
                .modelImageUrl(request.getModelImageUrl())
                .organization(organization)
                .build();

        // Handle tags
        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            List<Tag> tags = request.getTagNames().stream()
                    .map(tagService::getOrCreateTag)
                    .collect(Collectors.toList());
            aiModel.setTags(tags);
        }

        AIModel savedModel = aiModelRepository.save(aiModel);

        // Update organization total models count
        organization.setTotalModels(organization.getTotalModels() + 1);
        organizationRepository.save(organization);

        return convertToResponse(savedModel);
    }

    public AIModelResponse getAIModelById(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        // Increment view count
        aiModel.setViewCount(aiModel.getViewCount() + 1);
        aiModelRepository.save(aiModel);

        return convertToResponse(aiModel);
    }

    public AIModelResponse getAIModelBySlug(String slug) {
        AIModel aiModel = aiModelRepository.findByModelSlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        // Increment view count
        aiModel.setViewCount(aiModel.getViewCount() + 1);
        aiModelRepository.save(aiModel);

        return convertToResponse(aiModel);
    }

    public Page<AIModelResponse> getAllAIModels(Pageable pageable) {
        return aiModelRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public Page<AIModelResponse> getAIModelsByCategory(ModelCategory category, Pageable pageable) {
        return aiModelRepository.findByModelCategory(category, pageable)
                .map(this::convertToResponse);
    }

    public Page<AIModelResponse> getAIModelsByStatus(ModelStatus status, Pageable pageable) {
        return aiModelRepository.findByModelStatus(status, pageable)
                .map(this::convertToResponse);
    }

    public Page<AIModelResponse> getFeaturedAIModels(Pageable pageable) {
        return aiModelRepository.findByIsFeatured(true, pageable)
                .map(this::convertToResponse);
    }

    public Page<AIModelResponse> searchAIModels(String query, Pageable pageable) {
        return aiModelRepository.searchModels(query, pageable)
                .map(this::convertToResponse);
    }

    public List<AIModelResponse> getMostViewedModels(int limit) {
        return aiModelRepository.findMostViewedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AIModelResponse> getMostLikedModels(int limit) {
        return aiModelRepository.findMostLikedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AIModelResponse> getTopRatedModels(int limit) {
        return aiModelRepository.findTopRatedModels(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AIModelResponse updateAIModel(Long modelId, AIModelCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        aiModel.setModelDescription(request.getModelDescription());
        aiModel.setModelVersion(request.getModelVersion());
        aiModel.setModelCategory(request.getModelCategory());
        aiModel.setPricingType(request.getPricingType());
        aiModel.setModelPrice(request.getModelPrice());
        aiModel.setCurrency(request.getCurrency());
        aiModel.setPricingUnit(request.getPricingUnit());
        aiModel.setApiUrl(request.getApiUrl());
        aiModel.setDocumentationUrl(request.getDocumentationUrl());
        aiModel.setModelImageUrl(request.getModelImageUrl());

        AIModel savedModel = aiModelRepository.save(aiModel);
        return convertToResponse(savedModel);
    }

    @Transactional
    public void deleteAIModel(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));
        aiModel.setModelStatus(ModelStatus.INACTIVE);
        aiModelRepository.save(aiModel);
    }

    private AIModelResponse convertToResponse(AIModel aiModel) {
        AIModelResponse response = new AIModelResponse();
        BeanUtils.copyProperties(aiModel, response);
        // Handle nested objects conversion here if needed
        return response;
    }
}