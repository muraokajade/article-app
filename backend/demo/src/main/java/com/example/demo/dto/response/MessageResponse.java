package com.example.demo.dto.response;

import com.example.demo.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {

    private Long id;
    private String userEmail;
    private String title;
    private String question;
    private String adminEmail;
    private String response;
    private boolean closed;

    public static MessageResponse fromEntity(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getUserEmail(),
                message.getTitle(),
                message.getQuestion(),
                message.getAdminEmail(),
                message.getResponse(),
                message.isClosed()
        );
    }
}
