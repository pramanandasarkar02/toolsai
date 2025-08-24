package com.toolsai.server.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private Integer upvoteCount;
    private Integer downvoteCount;
    private Boolean isEdited;
    private Boolean isDeleted;
    private UserResponse user;
    private Long parentCommentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}