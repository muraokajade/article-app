import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const DeleteArticleFlow = () => {
  const controller = `
  @DeleteMapping("/article/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteArticle(@RequestHeader(name = "Authorization") String token,
                                            @PathVariable Long id) {
      firebaseAuthService.verifyAdminAndGetEmail(token);
      articleService.deleteArticle(id);
      return ResponseEntity.noContent().build();
  }`;

  const service = `
  public void deleteArticle(Long id) {
      ArticleEntity entity = articleRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("記事が存在しません。"));
      articleRepository.delete(entity);
  }`;

  const reactHandler = `
  const handleDelete = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await axios.delete(\`/api/admin/article/\${id}\`, {
        headers: {
          Authorization: \`Bearer \${idToken}\`,
        },
      });
      console.log("削除成功");
      setRefresh(!refresh);
    } catch (e) {
      console.error("削除失敗", e);
    }
  };`;

  const reactButton = `
  <button
    onClick={() => handleDelete(article.id)}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  >
    削除
  </button>`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        管理者による記事削除機能を実装する（安全かつ即時反映）
      </h1>

      <p>
        管理者は記事を一覧画面から削除できます。認証付きで{" "}
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          DELETE
        </code>{" "}
        リクエストを送信し、削除後に画面を更新します。
      </p>

      <h2 className="text-xl font-semibold mt-8">
        1. Controller：削除リクエストの受け取り
      </h2>
      <p>
        Firebaseトークンを検証し、管理者のみが削除可能とします。対象IDで記事を探し、
        存在すれば削除を実行します。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {controller}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">2. Service：記事の削除処理</h2>
      <p>Repositoryから対象のEntityを検索し、存在する場合のみ削除します。</p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {service}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">3. React：削除処理の送信</h2>
      <p>
        確認ダイアログのあと、axiosで削除リクエストを送信し、
        成功時には画面を再描画するために{" "}
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          setRefresh(!refresh)
        </code>{" "}
        を実行します。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {reactHandler}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">4. 削除ボタンのUI例</h2>
      <p>ボタンを押すことで削除がトリガーされます。</p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {reactButton}
      </SyntaxHighlighter>

      <p className="mt-6">
        この構成により、認証とUXを両立した安全な削除機能が実現できます。
      </p>
      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
