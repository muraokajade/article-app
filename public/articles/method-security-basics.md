# Spring Security の基本：`@EnableGlobalMethodSecurity` と SecurityContext の正しい使い方

---

## 1. アノテーションを有効にする

メソッドレベルでのアクセス制御（例：`@PreAuthorize`）を使うには、  
`@EnableGlobalMethodSecurity(prePostEnabled = true)` を付ける必要があります。  
セキュリティ設定クラス（通常は `@Configuration`）に記述します。

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .anyRequest().authenticated();
    }
}
```
2. SecurityContext への登録が必須
@PreAuthorize などのアノテーションが正しく動作するためには、
フィルターなどで検証済みの認証情報を SecurityContextHolder に登録しておく必要があります。

```java
FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
String email = decodedToken.getEmail();

List<GrantedAuthority> authorities = new ArrayList<>();
authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

UsernamePasswordAuthenticationToken auth =
    new UsernamePasswordAuthenticationToken(email, null, authorities);

// SecurityContext に認証情報を登録
SecurityContextHolder.getContext().setAuthentication(auth);
```

3. 失敗したときはどうなる？
認証情報が設定されていない状態で @PreAuthorize を使うと、
自動的に 403 Forbidden が返されます。
明示的な例外スローやレスポンス設定は不要です（Spring Security が処理します）。