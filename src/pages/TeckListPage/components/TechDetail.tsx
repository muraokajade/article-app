import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GetMethodReactSpring } from "./GetMethodReactSpring";

interface TechDetailDTO {
  slug: string;
  title: string;
  sectionTitle: string;
  content: string;
  imageUrl: string;
}

export const TechDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<TechDetailDTO | null>(null);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/articles/${slug}`)
      .then((res) => {
        setArticle(res.data);
        setApiFailed(false);
      })
      .catch(() => {
        setApiFailed(true);
      });
  }, [slug]);
  console.log("slug:", slug);

  // 1. APIで取得できた場合：その内容を表示
  if (article) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <h2 className="text-xl font-semibold text-blue-300 mb-2">
          {article.sectionTitle}
        </h2>
        <p className="text-gray-300 mb-4">{article.content}</p>
        <img
          src={article.imageUrl}
          alt={article.sectionTitle}
          className="w-full max-w-xl rounded shadow"
        />
      </div>
    );
  }

  // 2. APIが失敗した場合：slugごとにローカルJSXでフォールバック
  if (apiFailed) {
    switch (slug) {
      case "get-method-react-spring":
        return <GetMethodReactSpring />;
      // 他のローカル記事を追加したければここにcaseを足す
    }

    // 3. それでも該当がない場合
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold">記事が見つかりません</h1>
        <p>「{slug}」に関する技術記事はまだ登録されていません。</p>
      </div>
    );
  }

  // 4. ロード中
  return (
    <div className="p-6 text-white">
      <p>読み込み中...</p>
    </div>
  );
};
