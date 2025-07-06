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

// 省略：importとinterfaceは今のままでOK

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

  if (article) {
    return (
      <div className="p-6 text-white">
        {/* タイトル */}
        <h1 className="text-3xl font-bold mb-6 text-center">{article.title}</h1>

        {/* 画像とテキストの横並び */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 左側：画像 */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/assets/images/get-method.png"
              alt={article.sectionTitle}
              className="w-full max-w-md rounded shadow"
            />
          </div>

          {/* 右側：テキスト */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">
              {article.sectionTitle}
            </h2>
            <p className="text-gray-300 whitespace-pre-line">
              {article.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (apiFailed) {
    switch (slug) {
      case "get-method-react-spring":
        return <GetMethodReactSpring />;
    }

    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold">記事が見つかりません</h1>
        <p>「{slug}」に関する技術記事はまだ登録されていません。</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <p>読み込み中...</p>
    </div>
  );
};
