package com.example.demo.service;

import com.example.demo.dto.request.AdminQuestionRequest;
import com.example.demo.dto.response.MessagePageResponse;
import com.example.demo.dto.response.MessageResponse;
import com.example.demo.entity.Message;
import com.example.demo.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public void postMessage(Message messageRequest, String email) {
        Message message = new Message(messageRequest.getTitle(),messageRequest.getQuestion());
        message.setUserEmail(email);
        messageRepository.save(message);
    }

    public MessagePageResponse  getMessages(String email, Pageable pageable) {
        Page<Message> messagePage =  messageRepository.findByUserEmail(email, pageable);
        List<MessageResponse> messageResponseList = messagePage.getContent()
                .stream()
                .map(MessageResponse::fromEntity)
                .toList();
        return new MessagePageResponse(
                messageResponseList,
                messagePage.getNumber(),
                messagePage.getTotalPages(),
                messagePage.getTotalElements()
        );

    }

    public MessagePageResponse getMessages(boolean closed, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Message> messagePage = messageRepository.findByClosed(closed, pageable);
        List<MessageResponse> messageResponseList = messagePage.getContent()
                .stream()
                .map(MessageResponse::fromEntity)
                .toList();
        return new MessagePageResponse(
                messageResponseList,
                messagePage.getNumber(),
                messagePage.getTotalPages(),
                messagePage.getTotalElements()
        );
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest, String adminEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());
        if(!message.isPresent()) {
            throw new Exception("メッセージが見つかりません。");
        }
        message.get().setAdminEmail(adminEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }
}
