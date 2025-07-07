import { useEffect, useState } from "react";
import axios from "axios";
import { ArticleModel } from "../../models/ArticleModel"; 

type Props = {
  refresh: boolean;
};

export const ArticleList = ({ refresh }: Props) => {
  const [articles, setArticles] = useState<ArticleModel[]>([]);

  useEffect(() => {
    axios.get("/api/admin/articles").then((res) => {
      setArticles(res.data);
    });
  }, [refresh]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">📚 投稿済み記事</h2>
      {articles.map((article) => (
        <div key={article.id} className="border p-3 my-2 rounded shadow-sm">
          <h3 className="font-bold">{article.title}</h3>
          <p className="text-sm text-gray-600">{article.content}</p>
        </div>
      ))}
    </div>
  );
};
