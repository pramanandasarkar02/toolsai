package com.toolsai.server.controller;

import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<Boolean>> toggleLike(
            @PathVariable Long modelId,
            @RequestParam Long userId) {
        boolean liked = likeService.toggleLike(modelId, userId);
        String message = liked ? "Model liked successfully" : "Like removed successfully";
        return ResponseEntity.ok(ApiResponse.success(message, liked));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkLike(
            @PathVariable Long modelId,
            @RequestParam Long userId) {
        boolean liked = likeService.isLikedByUser(modelId, userId);
        return ResponseEntity.ok(ApiResponse.success(liked));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getLikeCount(@PathVariable Long modelId) {
        long count = likeService.getLikeCount(modelId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}