import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const SpringFirebaseFlow = () => {
  const firebaseInitCode = `@PostConstruct
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
}`;

  const firebaseFilterCode = `public class FirebaseTokenFilter extends OncePerRequestFilter {

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
}`;

  const securityConfigCode = `@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .authorizeHttpRequests()
        .antMatchers("/api/admin/**").hasRole("ADMIN") // 管理者専用
        .antMatchers("/api/user/**").authenticated()   // ログインユーザーならOK
        .anyRequest().permitAll()
        .and()
        .addFilterBefore(new FirebaseTokenFilter(), UsernamePasswordAuthenticationFilter.class);
}`;

  const preAuthorizeCode = `@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // 管理者のみアクセス許可
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/article")
    public ResponseEntity<?> postArticle(@RequestBody ArticleRequest request) {
        // 記事投稿処理
        return ResponseEntity.ok("記事を投稿しました");
    }
}`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h2 className="text-3xl mb-6">
        Spring Boot × Firebase Authentication：
        管理者権限をJWTから判定してAPIを制御する方法
      </h2>

      <h3 className="text-xl mb-2">
        1. Firebase Admin SDK の初期化（@PostConstruct）
      </h3>
      <p>
        Spring Boot で Firebase のトークン検証やカスタムクレームを扱うには、
        最初に Firebase Admin SDK の初期化が必要です。
        通常はアプリ起動時に一度だけ初期化すればOKです。
      </p>
      <p>以下はその初期化コードの実例です：</p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {firebaseInitCode}
      </SyntaxHighlighter>

      <p>
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          firebase-service-account.json
        </code>
        は事前に Firebase Console からダウンロードして、
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          src/main/resources/firebase/
        </code>
        に配置しておきます。
      </p>

      <Link to="/articles/firebase-admin-flow">
        <p className="text-blue-400 text-lg mt-4">
          🔗 Firebase側でのadmin claims付与の手順はこちら（前編）
        </p>
      </Link>

      <h3 className="text-xl mb-2 mt-4">
        2. FirebaseTokenFilter：JWTトークンの検証と権限の注入
      </h3>
      <p>
        クライアントから送られてきた Firebase JWT
        を検証し、カスタムクレーム（admin）の有無に応じて Spring Security
        に「ROLE_ADMIN」もしくは「ROLE_USER」の認証情報を注入するフィルターです。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {firebaseFilterCode}
      </SyntaxHighlighter>

      <p>
        フィルターはすべてのリクエストに対して走り、 認証済みであれば
        `SecurityContextHolder` にユーザーの認証状態が設定され、
        コントローラーやセキュリティ設定でアクセス制御が可能になります。
      </p>

      <Link to="/articles/do-filter-explanation">
        <p className="text-blue-400 text-lg mt-4">
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            filterChain.doFilter()の説明はこちら
          </code>
        </p>
      </Link>

      <h2 className="text-xl mb-6">
        Spring Security：
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          SecurityConfig
        </code>{" "}
        によるルーティング制御
      </h2>

      <h3 className="text-xl mb-2">3. 管理者だけにアクセスを許可する方法</h3>
      <p>
        FirebaseTokenFilterで
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          ROLE_ADMIN
        </code>
        を注入した後、
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          SecurityConfig
        </code>
        でURLごとのアクセス制御を定義します。 以下のコードでは、
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          /api/admin/**
        </code>
        は管理者だけがアクセスでき、
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          /api/user/**
        </code>
        はログイン済みユーザー全員に許可されます。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {securityConfigCode}
      </SyntaxHighlighter>

      <ul className="mt-4">
        <li>
          <span className="font-bold">
            <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
              hasRole("ADMIN")
            </code>
            ：
          </span>{" "}
          JWTに
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            admin: true
          </code>
          が含まれるユーザーのみアクセス可
        </li>
        <li>
          <span className="font-bold">
            <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
              authenticated()
            </code>
            ：
          </span>{" "}
          ログイン済みであれば誰でもアクセス可
        </li>
        <li>
          <span className="font-bold">
            <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
              permitAll()
            </code>
            ：
          </span>{" "}
          誰でもアクセスOK（例：ホーム画面など）
        </li>
        <li>
          <span className="font-bold">
            {" "}
            <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
              addFilterBefore()
            </code>
            ：
          </span>{" "}
          FirebaseTokenFilterをSpringの認証処理の前に追加
        </li>
      </ul>

      <h2 className="text-xl mb-6">
        Spring Security：
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @PreAuthorize
        </code>{" "}
        によるコントローラー単位の制御
      </h2>

      <h3 className="text-xl mb-2">4. メソッドごとにアクセス制御ができる</h3>
      <p>
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @PreAuthorize
        </code>{" "}
        を使うと、 コントローラーのメソッド単位でアクセス制限を設定できます。
        たとえば「記事投稿APIは管理者だけ許可」などの要件に便利です。
      </p>

      <h3 className="text-xl mt-4 mb-2">4. コード例</h3>
      <SyntaxHighlighter language="java" style={oneDark}>
        {preAuthorizeCode}
      </SyntaxHighlighter>

      <h3 className="text-xl mt-4 mb-2">5. 使用時の注意点</h3>
      <ul>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            @EnableGlobalMethodSecurity(prePostEnabled = true)
          </code>{" "}
          を{" "}
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            @Configuration
          </code>{" "}
          クラスに付ける必要があります。
        </li>
        <li>
          フィルター内で認証情報を正しく{" "}
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            SecurityContext
          </code>{" "}
          に登録すること。
        </li>
        <li>
          失敗時は自動的に 403 Forbidden
          を返します（明示的なハンドリング不要）。
        </li>
      </ul>
      <Link to="/articles/method-security-basics">
        <span className="text-blue-400 underline">
          @EnableGlobalMethodSecurity の解説はこちら
        </span>
      </Link>

      <h3 className="text-xl mt-4 mb-2">6. 他にも使える式</h3>
      <ul>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            hasRole('USER')
          </code>
          ：特定のロールを持つユーザーのみ
        </li>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            isAuthenticated()
          </code>
          ：ログイン済みであれば許可
        </li>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            permitAll()
          </code>
          ：すべてのユーザーに許可
        </li>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            #id == authentication.name
          </code>
          ：動的チェック（ユーザー自身か確認）
        </li>
      </ul>

      <Link to="/tech">
        <p className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
