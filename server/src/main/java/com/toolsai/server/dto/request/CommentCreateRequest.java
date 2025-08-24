package com.toolsai.server.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CommentCreateRequest {
    @NotBlank(message = "Comment content is required")
    @Size(max = 2000, message = "Comment cannot exceed 2000 characters")
    private String content;

    private Long parentCommentId;
}