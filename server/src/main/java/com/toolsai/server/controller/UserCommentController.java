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
@RequestMapping("/api/users/{userId}/comments")
@RequiredArgsConstructor
public class UserCommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsByUser(
            @PathVariable Long userId, Pageable pageable) {
        Page<CommentResponse> comments = commentService.getCommentsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}