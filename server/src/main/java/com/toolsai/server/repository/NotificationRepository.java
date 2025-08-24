package com.toolsai.server.repository;

import com.toolsai.server.model.Notification;
import com.toolsai.server.model.User;
import com.toolsai.server.model.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByReceiver(User receiver, Pageable pageable);
    Page<Notification> findByReceiverAndIsRead(User receiver, boolean isRead, Pageable pageable);
    Page<Notification> findByReceiverAndType(User receiver, NotificationType type, Pageable pageable);

    List<Notification> findBySender(User sender);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.receiver = :receiver AND n.isRead = false")
    long countUnreadNotificationsByReceiver(@Param("receiver") User receiver);
}