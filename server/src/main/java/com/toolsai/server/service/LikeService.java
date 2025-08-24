package com.toolsai.server.service;

import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelLike;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelLikeRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final AIModelLikeRepository likeRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean toggleLike(Long modelId, Long userId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (likeRepository.existsByUserAndAiModel(user, aiModel)) {
            likeRepository.deleteByUserAndAiModel(user, aiModel);
            aiModel.setLikeCount(aiModel.getLikeCount() - 1);
            aiModelRepository.save(aiModel);
            return false; // Like removed
        } else {
            AIModelLike like = AIModelLike.builder()
                    .user(user)
                    .aiModel(aiModel)
                    .build();
            likeRepository.save(like);

            aiModel.setLikeCount(aiModel.getLikeCount() + 1);
            aiModelRepository.save(aiModel);
            return true; // Like added
        }
    }

    public boolean isLikedByUser(Long modelId, Long userId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return likeRepository.existsByUserAndAiModel(user, aiModel);
    }

    public long getLikeCount(Long modelId) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        return likeRepository.countByAiModel(aiModel);
    }
}