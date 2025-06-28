package com.example.demo.security;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * Spring Security の全体的な設定を管理するクラス
 */
@Configuration // → このクラスが「設定クラス」であることをSpringに伝える（＝DIコンテナに登録される）
@RequiredArgsConstructor // → コンストラクタインジェクションを自動生成（finalフィールドに自動注入される）
public class SecurityConfiguration {

    // Firebase の認証処理を行うフィルター（コンストラクタインジェクション）
    private final FirebaseAuthenticationFilter firebaseFilter;

    /**
     * Spring Security のセキュリティチェーンを定義
     */
    @Bean // → このメソッドがBean定義であり、Springにより管理されることを示す
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // フロントエンド分離のため CSRF を無効化
                .cors().and() // CORS設定を有効に
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers( "/api/books/secure/**",
                                "/api/reviews/secure/**",
                                "/api/messages/secure/**",
                                "/api/admin/secure/**").authenticated() // /api/secure配下は要認証
                        .anyRequest().permitAll() // それ以外は全てアクセス許可
                )
                .formLogin(form -> form.disable()) // デフォルトのログイン画面を無効化
                .addFilterBefore(firebaseFilter, UsernamePasswordAuthenticationFilter.class); // 認証フィルターを登録

        return http.build(); // SecurityFilterChainを返す
    }

    /**
     * CORS（クロスオリジン）設定を定義するBean
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // リクエストを許可するフロントエンドのオリジン（URL）
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // ← React のローカルサーバー

        // 許可するHTTPメソッド
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 許可するヘッダー
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Cookieや認証情報を送ることを許可
        configuration.setAllowCredentials(true);

        // 上記設定を全URLパスに適用
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
