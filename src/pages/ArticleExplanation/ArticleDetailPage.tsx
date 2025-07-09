import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReviewScore } from "../ReviewPage/ReviewScore"; // ←さっきのやつ
import { useAuth } from "../../context/AuthContext"; // ←ログインユーザー取得用Hookなど
import axios from "axios";
export const ArticleDetailPage = () => {
  const [content, setContent] = useState("");
  const [articleId, setArticleId] = useState<number | null>(null); // 追加
  const { slug } = useParams();
  const { currentUser, idToken } = useAuth(); // ログイン中のユーザー

  const [myUserId, setMyUserId] = useState<number | null>(null);
  useEffect(() => {
    if (idToken) {
      axios
        .get("/api/me", {
          headers: { Authorization: `Bearer ${idToken}` },
        })
        .then((res) => {
          setMyUserId(res.data.id); // これが正しいmyUserId
        });
    }
  }, [idToken]);

  // 記事の本文とIDを両方fetch
  useEffect(() => {
    // 1. markdown取得
    fetch(`/articles/${slug}.md`)
      .then((res) => res.text())
      .then(setContent);

    // 2. 記事IDの取得
    fetch(`/api/articles/slug/${slug}`) // ←API設計例: slug→id
      .then((res) => res.json())
      .then((data) => setArticleId(data.id));
  }, [slug]);

  return (
    <div className="prose prose-invert max-w-4xl mx-auto py-10">
      <ReactMarkdown
        children={content}
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = Array.isArray(children)
              ? children.join("")
              : String(children);

            return match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="not-prose"
                {...props}
              >
                {codeString.replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      />

      {}
      {articleId && myUserId != null && (
        <ReviewScore
          articleId={articleId}
          myUserId={myUserId} // 数値型に合わせて必要ならparseIntなど
        />
      )}

      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
