package com.toolsai.server.service;

import com.toolsai.server.dto.request.CommentCreateRequest;
import com.toolsai.server.dto.response.CommentResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelComment;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelCommentRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final AIModelCommentRepository commentRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse createComment(Long modelId, Long userId, CommentCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AIModelComment comment = AIModelComment.builder()
                .content(request.getContent())
                .user(user)
                .aiModel(aiModel)
                .build();

        // Handle parent comment if provided
        if (request.getParentCommentId() != null) {
            AIModelComment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        AIModelComment savedComment = commentRepository.save(comment);

        // Update model comment count
        aiModel.setCommentCount(aiModel.getCommentCount() + 1);
        aiModelRepository.save(aiModel);

        return convertToResponse(savedComment);
    }

    public Page<CommentResponse> getCommentsByModel(Long modelId, Pageable pageable) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        return commentRepository.findTopLevelCommentsByModel(aiModel, pageable)
                .map(this::convertToResponse);
    }

    public Page<CommentResponse> getCommentsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return commentRepository.findByUserAndIsDeleted(user, false, pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, Long userId, CommentCreateRequest request) {
        AIModelComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        comment.setIsEdited(true);

        AIModelComment savedComment = commentRepository.save(comment);
        return convertToResponse(savedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        AIModelComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own comments");
        }

        comment.setIsDeleted(true);
        commentRepository.save(comment);

        // Update model comment count
        AIModel aiModel = comment.getAiModel();
        aiModel.setCommentCount(aiModel.getCommentCount() - 1);
        aiModelRepository.save(aiModel);
    }

    private CommentResponse convertToResponse(AIModelComment comment) {
        CommentResponse response = new CommentResponse();
        BeanUtils.copyProperties(comment, response);
        if (comment.getParentComment() != null) {
            response.setParentCommentId(comment.getParentComment().getId());
        }
        return response;
    }
}