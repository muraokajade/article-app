package com.article.backend.controller;

import com.article.backend.dto.UserDTO;
import com.article.backend.entity.UserEntity;
import com.article.backend.repository.UserRepository;
import com.article.backend.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/")
@RequiredArgsConstructor
public class UserController {

    private final FirebaseAuthService firebaseAuthService;
    private final UserRepository userRepository;
    @GetMapping("/me")
    public UserDTO getMe(@RequestHeader("Authorization") String token) {
        String email = firebaseAuthService.verifyAdminAndGetEmail(token);

        UserEntity user = userRepository.findByEmail(email).orElseThrow();
        return UserDTO.of(user); // id, email, ... を含む
    }

}
