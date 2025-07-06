import { Link } from "react-router-dom";

export const ArticleList = () => {
  const articles = [
    { slug: "spring-get", title: "Spring BootでGETエンドポイント作成" },
    { slug: "spring-post", title: "POSTリクエストを送る" },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">技術記事一覧</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/tech/${article.slug}`}
              className="text-blue-400 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
