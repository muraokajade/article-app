import { useState } from "react";
import { AddArticleForm } from "./components/AddArticleForm"; 
import { ArticleList } from "../TeckListPage/ArticleList"; 

export const AdminPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠 管理者ダッシュボード</h1>
      <AddArticleForm onSuccess={handleRefresh} />
      <ArticleList refresh={refresh} setRefresh={handleRefresh}/>
    </div>
  );
};