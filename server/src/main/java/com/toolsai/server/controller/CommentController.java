package com.toolsai.server.controller;

import com.toolsai.server.dto.request.CommentCreateRequest;
import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.CommentResponse;
import com.toolsai.server.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/models/{modelId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long modelId,
            @RequestParam Long userId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse comment = commentService.createComment(modelId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", comment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsByModel(
            @PathVariable Long modelId, Pageable pageable) {
        Page<CommentResponse> comments = commentService.getCommentsByModel(modelId, pageable);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long modelId,
            @PathVariable Long commentId,
            @RequestParam Long userId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse comment = commentService.updateComment(commentId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long modelId,
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
