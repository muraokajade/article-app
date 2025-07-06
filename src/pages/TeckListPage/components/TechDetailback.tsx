import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  const [notFound, setNotFound] = useState(false);

  console.log("画像URL:", article?.imageUrl);

  //console.log(article?.imageUrl)
  useEffect(() => {
    axios
      .get(`/api/articles/${slug}`) // ← ここで Spring Boot のエンドポイントを叩いている
      .then((res) => {
        console.log("画像URL:", res.data.imageUrl); // ← ここ追加
        setArticle(res.data);
        setNotFound(false);
      })
      .catch(() => {
        setNotFound(true);
      });
  }, [slug]);

  if (!article) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
        <p>「{slug}」に関する技術記事はまだ登録されていません。</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <br />
      <h2 className="text-xl font-semibold text-blue-300 mb-2">
        {article.sectionTitle}
      </h2>
      <br />
      <p className="text-gray-300 mb-4">{article.content}</p>
      <img
        src="/assets/images/get-method.png"
        alt={article.sectionTitle}
        className="w-full max-w-xl rounded shadow"
      />
    </div>
  );
};
