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
@RequestMapping("/api/users/{userId}/ratings")
@RequiredArgsConstructor
public class UserRatingController {

    private final RatingService ratingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getRatingsByUser(
            @PathVariable Long userId, Pageable pageable) {
        Page<RatingResponse> ratings = ratingService.getRatingsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }
}