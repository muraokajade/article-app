import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ArticleModel } from "../../../models/ArticleModel";
import axios from "axios";

export const EditArticleFlowReact = () => {

  const state = `
      const [slug, setSlug] = useState("");
      const [title, setTitle] = useState("");
      const [sectionTitle, setSectionTitle] = useState("");
      const [content, setContent] = useState("");
      const [imageFile, setImageFile] = useState<File | null>(null);`;

  const axiosGet = `{
    const handleEdit = async (id: number) => {
    if (loading) return;
    try {
      const res = await axios.get(/api/admin/article/\${id}, {
        headers: {
          Authorization: \`Bearer \${idToken}\`,
        },
      });
      const article = res.data;
      setArticle(article);

      // 編集対象の記事情報をステートにセット
      setSlug(article.slug);
      setTitle(article.title);
      setContent(article.content);
      setSectionTitle(article.sectionTitle);

      setIsEditModalOpen(true);
    } catch (err) {
      console.error("❌ 取得失敗", err);
      alert("投稿に失敗しました");
    }
  }
  `;

  const axiosReGet = `
  const refreshed = await axios.get("/api/admin/articles", {
        headers: {
          Authorization: \`Bearer \${idToken}\`,
        },
      });

      setArticles(refreshed.data);
      setIsEditModalOpen(false);
  `;
  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        管理者による記事編集機能を実装する（モーダル機能で素早く反映）
      </h1>

      <p className="text-xl font-semibold mt-8">・管理者画面ボタン表示</p>
      <img src="/assets/images/article.png" alt="list" />

      <p className="text-xl font-semibold mt-8">
        ・編集ボタン押下でモーダルが出現
      </p>
      <img src="/assets/images/modal.png" alt="list" />
      <h2 className="text-xl font-semibold mt-8">1. ステートと更新関数機能</h2>
      <p>
        管理者は記事リスト上から素早く編集モーダルを開き、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          title
        </code>{" "}
        や{" "}
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          content
        </code>{" "}
        などを編集・管理できます。 以下はReact側の編集処理に関する構成です。
      </p>

      <SyntaxHighlighter language="tsx" style={oneDark}>
        {state}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">
        2. 特定記事に基づくGETリクエスト処理
      </h2>

      <p>
        編集前の記事内容を取得するために、管理者トークン付きで
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          axios.get
        </code>{" "}
        を使用します。 データベースから得た情報を元に
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          状態関数化(useState)
        </code>{" "}
        で管理します。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {axiosGet}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">3. PUTリクエスト処理</h2>
      <p>
        編集内容を送信するために、管理者トークン付きで
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          formData
        </code>{" "}
        を組み立てます。その後
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          axios.put
        </code>{" "}
        を使用します。 フォーム送信は
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          FormData
        </code>{" "}
        により行い、将来的な画像対応にも拡張可能です。
      </p>

      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`const handleUpdate = async (id: number) => {
  try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("title", title);
      formData.append("sectionTitle", sectionTitle);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
    const res = await axios.put(\`/api/admin/article/\${id}\`, formData, {
      headers: {
        Authorization: \`Bearer \${idToken}\`,
      },
    });

    console.log("更新成功:", res.data);
  } catch (e) {
    console.error("更新失敗", e);
  }
};`}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">4. 編集モーダルのUI</h2>
      <p>
        編集UIはモーダル内に表示され、即時に反映できる構成です。以下は基本的なUI構造の一例です。
      </p>

      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`<div className="mt-6 border-t pt-4">
  <h3 className="text-xl font-semibold mb-2">記事の編集</h3>

  <input
    className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
    placeholder="タイトル"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <textarea
    className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
    placeholder="本文"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={6}
  />

  <button
    onClick={() => handleUpdate(article?.id || 0)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    更新する
  </button>
</div>`}
      </SyntaxHighlighter>
      <h2 className="text-xl font-semibold mt-8">
        5. データ再取得とモーダルを閉じる
      </h2>
      <p>即時にデータを再取得してモーダルを閉じます</p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {axiosReGet}
      </SyntaxHighlighter>

      <p className="mt-6">
        このように、React側ではデータ取得・ステート管理・PUT送信・UI表示までを明確に分離し、
        編集後に即座に画面上へ反映されるUXを実現しています。
      </p>
      <Link to="/articles/article-edit-spring">
        <p className="text-blue-400 text-lg mt-4">Springの説明を見る</p>
      </Link>
      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
