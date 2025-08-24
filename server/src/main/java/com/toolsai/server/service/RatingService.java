package com.toolsai.server.service;

import com.toolsai.server.dto.request.RatingCreateRequest;
import com.toolsai.server.dto.response.RatingResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.AIModel;
import com.toolsai.server.model.AIModelRating;
import com.toolsai.server.model.User;
import com.toolsai.server.repository.AIModelRatingRepository;
import com.toolsai.server.repository.AIModelRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final AIModelRatingRepository ratingRepository;
    private final AIModelRepository aiModelRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse createOrUpdateRating(Long modelId, Long userId, RatingCreateRequest request) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<AIModelRating> existingRating = ratingRepository.findByUserAndAiModel(user, aiModel);

        AIModelRating rating;
        if (existingRating.isPresent()) {
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setReview(request.getReview());
        } else {
            rating = AIModelRating.builder()
                    .rating(request.getRating())
                    .review(request.getReview())
                    .user(user)
                    .aiModel(aiModel)
                    .build();
        }

        AIModelRating savedRating = ratingRepository.save(rating);

        // Update model rating statistics
        updateModelRatingStatistics(aiModel);

        return convertToResponse(savedRating);
    }

    public Page<RatingResponse> getRatingsByModel(Long modelId, Pageable pageable) {
        AIModel aiModel = aiModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Model not found"));

        return ratingRepository.findByAiModel(aiModel, pageable)
                .map(this::convertToResponse);
    }

    public Page<RatingResponse> getRatingsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ratingRepository.findByUser(user, pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        AIModelRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own ratings");
        }

        AIModel aiModel = rating.getAiModel();
        ratingRepository.delete(rating);

        // Update model rating statistics
        updateModelRatingStatistics(aiModel);
    }

    private void updateModelRatingStatistics(AIModel aiModel) {
        long ratingCount = ratingRepository.countByAiModel(aiModel);
        BigDecimal averageRating = ratingRepository.findAverageRatingByAiModel(aiModel);

        aiModel.setRatingCount((int) ratingCount);
        aiModel.setAverageRating(averageRating != null ?
                averageRating.setScale(2, RoundingMode.HALF_UP) : null);

        aiModelRepository.save(aiModel);
    }

    private RatingResponse convertToResponse(AIModelRating rating) {
        RatingResponse response = new RatingResponse();
        BeanUtils.copyProperties(rating, response);
        return response;
    }
}