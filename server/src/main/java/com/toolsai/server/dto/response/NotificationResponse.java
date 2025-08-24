package com.toolsai.server.dto.response;

import com.toolsai.server.model.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private String actionUrl;
    private String data;
    private UserResponse sender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
