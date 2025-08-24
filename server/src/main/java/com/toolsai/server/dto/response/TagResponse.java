package com.toolsai.server.dto.response;

import lombok.Data;

@Data
public class TagResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String color;
    private Integer usageCount;
}
