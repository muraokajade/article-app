export const GetMethodReactSpring = () => {

  
  console.log("✅ GetMethodReactSpring 表示中");
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        GETメソッドで記事取得（React × Spring Boot）
      </h1>
      <p>
        このページでは、ReactからSpring Boot
        <br />
        APIを通じて記事を取得する流れを解説します。
      </p>

      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li className="block">ReactからGET `/api/articles/:slug` を呼び出す</li>
        <li className="block">Spring Bootがslugを使ってDBから記事を検索</li>
        <li className="block">MySQLに問い合わせて該当データを取得</li>
        <li className="block">JSONでReactに返却し、表示</li>
      </ol>
    </div>
  );
};
