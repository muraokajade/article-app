import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Link } from "react-router-dom";

export const DoFilterExplanation = () => {
  const doFilterCode = `@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {

    // 🔐 Firebaseトークン検証など、認証ロジックをここに実装
    // （例）SecurityContextに認証情報をセットする処理など

    System.out.println("🔥 カスタムフィルター処理が呼び出されました");

    // ✅ 認証が成功したら、次のフィルターやコントローラーに処理を進める
    filterChain.doFilter(request, response);

    // ⚠️ この行を呼ばなければ、リクエストは途中で止まります
}`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h2 className="text-3xl mb-6">
        Spring Security：
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          filterChain.doFilter()
        </code>{" "}
        の意味と使い方
      </h2>

      <h3 className="text-xl mb-2">1. これは何のため？</h3>
      <p>
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          filterChain.doFilter(request, response)
        </code>{" "}
        は、 「このリクエストは通して良いよ」と次の処理へ渡す合図です。
        呼ばなければコントローラーまで届かず、認証があってもページは返りません。
      </p>

      <h3 className="text-xl mt-4 mb-2">2. 実際のコード例（コメント付き）</h3>
      <SyntaxHighlighter language="java" style={oneDark}>
        {doFilterCode}
      </SyntaxHighlighter>

      <h3 className="text-xl mt-4 mb-2">3. どこに進むの？</h3>
      <ul>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            UsernamePasswordAuthenticationFilter
          </code>{" "}
          や他のセキュリティフィルター
        </li>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            ExceptionTranslationFilter
          </code>{" "}
          などの例外制御
        </li>
        <li>
          <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
            @RestController
          </code>{" "}
          が処理を引き継ぐ
        </li>
      </ul>

      <h3 className="text-xl mt-4 mb-2">4. 呼ばなかったら？</h3>
      <p>
        <code className="font-bold bg-zinc-800 text-yellow-300 px-1 py-0.5 rounded">
          doFilter()
        </code>{" "}
        を呼ばなければ、レスポンスは返されず、
        クライアントは「無反応」またはエラー画面（403など）を受け取ります。
      </p>

      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
