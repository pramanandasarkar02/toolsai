package com.toolsai.server.controller;

import com.toolsai.server.dto.response.ApiResponse;
import com.toolsai.server.dto.response.TagResponse;
import com.toolsai.server.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TagResponse>>> getAllTags(Pageable pageable) {
        Page<TagResponse> tags = tagService.getAllTags(pageable);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<TagResponse>>> getMostUsedTags(
            @RequestParam(defaultValue = "20") int limit) {
        List<TagResponse> tags = tagService.getMostUsedTags(limit);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TagResponse>>> searchTags(
            @RequestParam String query, Pageable pageable) {
        Page<TagResponse> tags = tagService.searchTags(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
}