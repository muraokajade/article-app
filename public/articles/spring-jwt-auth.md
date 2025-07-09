# Spring Boot × Firebase Authentication：管理者権限をJWTから判定してAPIを制御する方法

---

## 1. Firebase Admin SDK の初期化（@PostConstruct）

Spring Boot で Firebase のトークン検証やカスタムクレームを扱うには、  
最初に Firebase Admin SDK の初期化が必要です。  
通常はアプリ起動時に一度だけ初期化すればOKです。

**初期化コード例：**

```java
@PostConstruct
public void initialize() {
    try {
        FileInputStream serviceAccount =
            new FileInputStream("src/main/resources/firebase/firebase-service-account.json");

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        System.out.println("✅ Firebase initialized");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
firebase-service-account.json は事前に Firebase Console からダウンロードして
src/main/resources/firebase/ に配置しておきます。
2. FirebaseTokenFilter：JWTトークンの検証と権限の注入
クライアントから送られてきた Firebase JWT を検証し、
カスタムクレーム（admin）の有無に応じて Spring Security に
「ROLE_ADMIN」もしくは「ROLE_USER」の認証情報を注入するフィルターです。

実装例：
```java
public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // AuthorizationヘッダーからBearerトークンを取得
        String token = getTokenFromHeader(request);

        if (token != null) {
            try {
                // Firebaseトークンを検証してデコード
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                String email = decodedToken.getEmail();

                // カスタムクレーム "admin" の取得
                Boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");

                // 権限リストの構築
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (Boolean.TRUE.equals(isAdmin)) { //NullPointerException回避の書き方
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN")); // 管理者
                } else {
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));  // 一般ユーザー
                }

                // 認証トークンの生成とSecurityContextへの登録
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (FirebaseAuthException e) {
                logger.warn("Firebaseトークンの検証に失敗しました: " + e.getMessage());
            }
        }

        // 次のフィルターに処理を委譲
        filterChain.doFilter(request, response);
    }

    // Authorizationヘッダーから"Bearer "トークンを抽出
    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // "Bearer " を除去
        }
        return null;
    }
}
```
フィルターはすべてのリクエストに対して走り、
認証済みであれば SecurityContextHolder にユーザーの認証状態が設定され、
コントローラーやセキュリティ設定でアクセス制御が可能になります。

3. Spring Security: SecurityConfigによるルーティング制御
管理者だけにアクセスを許可する方法
FirebaseTokenFilterで ROLE_ADMIN を注入した後、
SecurityConfig でURLごとのアクセス制御を定義します。

例：
```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .authorizeHttpRequests()
        .antMatchers("/api/admin/**").hasRole("ADMIN") // 管理者専用
        .antMatchers("/api/user/**").authenticated()   // ログインユーザーならOK
        .anyRequest().permitAll()
        .and()
        .addFilterBefore(new FirebaseTokenFilter(), UsernamePasswordAuthenticationFilter.class);
}
```
- hasRole("ADMIN") … JWTに admin: true が含まれるユーザーのみアクセス可
- authenticated() … ログイン済みであれば誰でもアクセス可
- permitAll() … 誰でもアクセスOK（例：ホーム画面など）
- addFilterBefore() … FirebaseTokenFilterをSpringの認証処理の前に追加

4. @PreAuthorize によるコントローラー単位の制御
メソッドごとにアクセス制御ができる
@PreAuthorize を使うと、コントローラーのメソッド単位でアクセス制限を設定できます。
たとえば「記事投稿APIは管理者だけ許可」などの要件に便利です。

例：
```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // 管理者のみアクセス許可
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/article")
    public ResponseEntity<?> postArticle(@RequestBody ArticleRequest request) {
        // 記事投稿処理
        return ResponseEntity.ok("記事を投稿しました");
    }
}
```
使用時の注意点
@EnableGlobalMethodSecurity(prePostEnabled = true) を @Configuration クラスに付ける必要あり

フィルター内で認証情報を正しく SecurityContext に登録すること

失敗時は自動的に 403 Forbidden を返します（明示的なハンドリング不要）

他にも使える式
hasRole('USER') … 特定のロールを持つユーザーのみ

isAuthenticated() … ログイン済みであれば許可

permitAll() … すべてのユーザーに許可

#id == authentication.name … 動的チェック（ユーザー自身か確認）

