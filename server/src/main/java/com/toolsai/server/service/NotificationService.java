package com.toolsai.server.service;

import com.toolsai.server.dto.response.NotificationResponse;
import com.toolsai.server.exception.ResourceNotFoundException;
import com.toolsai.server.model.Notification;
import com.toolsai.server.model.User;
import com.toolsai.server.model.enums.NotificationType;
import com.toolsai.server.repository.NotificationRepository;
import com.toolsai.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public NotificationResponse createNotification(Long receiverId, String title, String message,
                                                   NotificationType type, Long senderId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        User sender = null;
        if (senderId != null) {
            sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        }

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .receiver(receiver)
                .sender(sender)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        return convertToResponse(savedNotification);
    }

    public Page<NotificationResponse> getNotificationsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByReceiver(user, pageable)
                .map(this::convertToResponse);
    }

    public Page<NotificationResponse> getUnreadNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByReceiverAndIsRead(user, false, pageable)
                .map(this::convertToResponse);
    }

    public long getUnreadNotificationCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.countUnreadNotificationsByReceiver(user);
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getReceiver().getId().equals(userId)) {
            throw new IllegalStateException("You can only mark your own notifications as read");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Notification> unreadNotifications = notificationRepository.findByReceiverAndIsRead(
                user, false, Pageable.unpaged());

        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    private NotificationResponse convertToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        BeanUtils.copyProperties(notification, response);
        return response;
    }
}