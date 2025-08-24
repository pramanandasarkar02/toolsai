package com.toolsai.server.service;

import com.toolsai.server.dto.response.TagResponse;
import com.toolsai.server.model.Tag;
import com.toolsai.server.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public Tag getOrCreateTag(String tagName) {
        return tagRepository.findByName(tagName.toLowerCase())
                .orElseGet(() -> {
                    Tag tag = Tag.builder()
                            .name(tagName.toLowerCase())
                            .slug(tagName.toLowerCase().replaceAll("[^a-z0-9]", "-"))
                            .build();
                    return tagRepository.save(tag);
                });
    }

    public Page<TagResponse> getAllTags(Pageable pageable) {
        return tagRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public List<TagResponse> getMostUsedTags(int limit) {
        return tagRepository.findMostUsedTags(Pageable.ofSize(limit))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<TagResponse> searchTags(String query, Pageable pageable) {
        return tagRepository.searchTags(query, pageable)
                .map(this::convertToResponse);
    }

    private TagResponse convertToResponse(Tag tag) {
        TagResponse response = new TagResponse();
        BeanUtils.copyProperties(tag, response);
        return response;
    }
}