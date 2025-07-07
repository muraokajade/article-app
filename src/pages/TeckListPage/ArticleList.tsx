import { useEffect, useState } from "react";
import axios from "axios";
import { ArticleModel } from "../../models/ArticleModel";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

type Props = {
  refresh: boolean;
};

export const ArticleList = ({ refresh }: Props) => {
  const [articles, setArticles] = useState<ArticleModel[]>([]);
  const { loading, currentUser, idToken } = useAuth();

  const togglePublish = async (slug: string) => {
    if (loading) return;
    try {
      await axios.put(`/api/admin/articles/${slug}/toggle`, null, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // 再取得
      const updated = await axios.get("/api/admin/articles", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setArticles(updated.data);
    } catch (e) {
      console.error("公開状態切替失敗", e);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      if (loading) return;
      try {
        const res = await axios.get("/api/admin/articles", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log("取得した記事一覧:", res.data); 
        setArticles(res.data);
      } catch (e) {
        console.error("記事取得失敗", e);
      }
    };
    fetchArticles();
  }, [refresh, loading, currentUser,idToken]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">📚 投稿済み記事</h2>

      <div className="space-y-2">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="flex items-start bg-gray-800 text-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md"
          >
            {/* 左側：基本情報 */}
            <div className="w-1/3 pr-4 text-sm space-y-1">
              <p className="font-semibold text-lg">{article.title}</p>
              <p className="text-gray-400">Slug: {article.slug}</p>
              <p className="text-gray-400">
                セクション: {article.sectionTitle}
              </p>
              <p className="text-gray-500 text-xs">
                投稿日: {dayjs(article.createdAt).format("YYYY/MM/DD HH:mm")}
              </p>
            </div>

            {/* 中央：縦線 */}
            <div className="border-l border-gray-600 h-full mx-4" />

            {/* 中央右：コンテンツ本文（長文・折り返し） */}
            <div className="flex-1 text-sm text-gray-200 break-words pr-4">
              {article.content}
            </div>

            {/* 右端：編集・削除ボタン */}
            <div className="flex flex-col space-y-2 items-end">
              <button
                onClick={() => togglePublish(article.slug)}
                className={`text-sm ${
                  article.published ? "text-green-400" : "text-yellow-400"
                } hover:underline`}
              >
                {article.published ? "公開中 → 非公開に" : "非公開 → 公開に"}
              </button>
              <button
                // onClick={() => handleEdit(article.slug)}
                className="text-blue-400 hover:text-blue-200 text-sm"
              >
                編集
              </button>
              <button
                // onClick={() => handleDelete(article.slug)}
                className="text-red-400 hover:text-red-200 text-sm"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
