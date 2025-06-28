package com.example.demo.util;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

public class FirebaseUtil {

    public static String extractUserEmailFromToken(String token) throws FirebaseAuthException {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("無効なトークン形式です");
        }

        String idToken = token.replace("Bearer ", "");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        return decodedToken.getEmail();
    }
}
