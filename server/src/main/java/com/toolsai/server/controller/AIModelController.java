package com.toolsai.server.controller;

import com.toolsai.server.dto.request.AIModelCreateRequest;
import com.toolsai.server.dto.response.AIModelResponse;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.model.enums.ModelCategory;
import com.toolsai.server.model.enums.ModelStatus;
import com.toolsai.server.service.AIModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class AIModelController {

    private final AIModelService aiModelService;

    @PostMapping
    public ResponseEntity<ApiResponse<AIModelResponse>> createAIModel(
            @Valid @RequestBody AIModelCreateRequest request) {
        AIModelResponse model = aiModelService.createAIModel(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AI Model created successfully", model));
    }

    @GetMapping("/{modelId}")
    public ResponseEntity<ApiResponse<AIModelResponse>> getAIModelById(@PathVariable Long modelId) {
        AIModelResponse model = aiModelService.getAIModelById(modelId);
        return ResponseEntity.ok(ApiResponse.success(model));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<AIModelResponse>> getAIModelBySlug(@PathVariable String slug) {
        AIModelResponse model = aiModelService.getAIModelBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(model));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAllAIModels(Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAllAIModels(pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAIModelsByCategory(
            @PathVariable ModelCategory category, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAIModelsByCategory(category, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getAIModelsByStatus(
            @PathVariable ModelStatus status, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getAIModelsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> getFeaturedAIModels(Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.getFeaturedAIModels(pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<AIModelResponse>>> searchAIModels(
            @RequestParam String query, Pageable pageable) {
        Page<AIModelResponse> models = aiModelService.searchAIModels(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/trending/most-viewed")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getMostViewedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getMostViewedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/trending/most-liked")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getMostLikedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getMostLikedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/trending/top-rated")
    public ResponseEntity<ApiResponse<List<AIModelResponse>>> getTopRatedModels(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIModelResponse> models = aiModelService.getTopRatedModels(limit);
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @PutMapping("/{modelId}")
    public ResponseEntity<ApiResponse<AIModelResponse>> updateAIModel(
            @PathVariable Long modelId,
            @Valid @RequestBody AIModelCreateRequest request) {
        AIModelResponse model = aiModelService.updateAIModel(modelId, request);
        return ResponseEntity.ok(ApiResponse.success("AI Model updated successfully", model));
    }

    @DeleteMapping("/{modelId}")
    public ResponseEntity<ApiResponse<Void>> deleteAIModel(@PathVariable Long modelId) {
        aiModelService.deleteAIModel(modelId);
        return ResponseEntity.ok(ApiResponse.success("AI Model deleted successfully", null));
    }
}