export const GetMethodReactSpring = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        GETメソッドで記事取得（React × Spring Boot）
      </h1>
      <p>
        このページでは、ReactからSpring Boot
        APIを通じて記事を取得する流れを解説します。
      </p>

      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li>ReactからGET `/api/articles/:slug` を呼び出す</li>
        <li>Spring Bootがslugを使ってDBから記事を検索</li>
        <li>MySQLに問い合わせて該当データを取得</li>
        <li>JSONでReactに返却し、表示</li>
      </ol>
    </div>
  );
};
