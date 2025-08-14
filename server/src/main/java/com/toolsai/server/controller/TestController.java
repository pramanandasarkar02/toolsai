package com.toolsai.server.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/public/welcome")
    public String publicAccess() {
        return "Welcome! This is a public endpoint.";
    }

    @GetMapping("/guest/content")
    @PreAuthorize("hasRole('GUEST') or hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public String guestAccess() {
        return "Guest Content - Available to all authenticated users.";
    }

    @GetMapping("/user/content")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public String userAccess() {
        return "User Content - Available to USER, MODERATOR, and ADMIN roles.";
    }

    @GetMapping("/moderator/content")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public String moderatorAccess() {
        return "Moderator Content - Available to MODERATOR and ADMIN roles.";
    }

    @GetMapping("/admin/content")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Content - Available only to ADMIN role.";
    }
}