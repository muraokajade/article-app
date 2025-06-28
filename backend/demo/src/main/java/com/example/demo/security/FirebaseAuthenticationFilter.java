package com.example.demo.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * このフィルターは、リクエストの Authorization ヘッダーに含まれる Firebase JWT を検証し、
 * 認証情報を SecurityContext にセットすることで、Spring Security にユーザーの認証状態を伝える。
 */
@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // クライアントから送られてくる Authorization ヘッダーを取得
        String authHeader = request.getHeader("Authorization");

        // ヘッダーが存在し、"Bearer " で始まるかを確認
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // "Bearer " を取り除いて、トークン本体を取得
            String idToken = authHeader.substring(7);

            try {
                // Firebase のサーバーでトークンを検証
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

                // トークンが有効なら、Spring Security に認証情報として渡す
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                decodedToken.getUid(),           // principal（ユーザー識別子）
                                null,                            // credentials（パスワード不要）
                                Collections.emptyList()          // authorities（必要に応じて権限追加可能）
                        );

                // リクエストの詳細情報を付加（IPアドレス、セッションIDなど）
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 認証情報を SecurityContext に登録（これで認証状態が他の層でも有効に）
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // トークンが無効な場合などはログ出力し、認証処理をスキップ
                System.out.println("❌ Invalid Firebase token: " + e.getMessage());
            }
        }

        // フィルター連鎖を継続（次のフィルターやリソースに処理を渡す）
        filterChain.doFilter(request, response);
    }
}
