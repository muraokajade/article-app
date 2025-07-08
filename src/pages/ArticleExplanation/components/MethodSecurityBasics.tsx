import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const MethodSecurityBasics = () => {
  const enableGlobalMethodSecurityCode = `@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .anyRequest().authenticated();
    }
}`;

  const contextRegistrationCode = `FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
String email = decodedToken.getEmail();

List<GrantedAuthority> authorities = new ArrayList<>();
authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

UsernamePasswordAuthenticationToken auth =
    new UsernamePasswordAuthenticationToken(email, null, authorities);

// SecurityContext に認証情報を登録
SecurityContextHolder.getContext().setAuthentication(auth);`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h2 className="text-3xl mb-6">
        Spring Security の基本：
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @EnableGlobalMethodSecurity
        </code>{" "}
        と SecurityContext の正しい使い方
      </h2>

      <h3 className="text-xl mb-2">1. アノテーションを有効にする</h3>
      <p>
        メソッドレベルでのアクセス制御（例：
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">@PreAuthorize</code>）を使うには、
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @EnableGlobalMethodSecurity(prePostEnabled = true)
        </code>{" "}
        を付ける必要があります。
        <br />
        セキュリティ設定クラス（通常は{" "}
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">@Configuration</code>）に記述します。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {enableGlobalMethodSecurityCode}
      </SyntaxHighlighter>

      <h3 className="text-xl mt-6 mb-2">2. SecurityContext への登録が必須</h3>
      <p>
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @PreAuthorize
        </code>{" "}
        などのアノテーションが正しく動作するためには、
        フィルターなどで検証済みの認証情報を{" "}
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          SecurityContextHolder
        </code>{" "}
        に登録しておく必要があります。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {contextRegistrationCode}
      </SyntaxHighlighter>

      <h3 className="text-xl mt-6 mb-2">3. 失敗したときはどうなる？</h3>
      <p>
        認証情報が設定されていない状態で{" "}
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          @PreAuthorize
        </code>{" "}
        を使うと、自動的に{" "}
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          403 Forbidden
        </code>{" "}
        が返されます。
        <br />
        明示的な例外スローやレスポンス設定は不要です（Spring Security が処理します）。
      </p>

      <Link to="/tech">
        <p className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
