package com.toolsai.server.controller;

import com.toolsai.server.dto.request.RatingCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.RatingResponse;
import com.toolsai.server.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> createOrUpdateRating(
            @PathVariable Long modelId,
            @RequestParam Long userId,
            @Valid @RequestBody RatingCreateRequest request) {
        RatingResponse rating = ratingService.createOrUpdateRating(modelId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Rating saved successfully", rating));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getRatingsByModel(
            @PathVariable Long modelId, Pageable pageable) {
        Page<RatingResponse> ratings = ratingService.getRatingsByModel(modelId, pageable);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @PathVariable Long modelId,
            @PathVariable Long ratingId,
            @RequestParam Long userId) {
        ratingService.deleteRating(ratingId, userId);
        return ResponseEntity.ok(ApiResponse.success("Rating deleted successfully", null));
    }
}