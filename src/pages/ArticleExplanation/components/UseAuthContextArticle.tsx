// src/ArticleExplanation/useAuthContext.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const useAuthCode = `import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../libs/firebase";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};`;

const indexTsCode = `// src/context/index.ts
export { AuthProvider, useAuth } from "./useAuth";`;

const usageCode = `import { useAuth } from "@/context";

const ProtectedComponent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>確認中...</p>;
  if (!isAuthenticated) return <p>ログインが必要です。</p>;

  return <div>ログイン済のコンテンツ</div>;
};`;

const appWrapCode = `// App.tsx
import { AuthProvider } from "@/context";

function App() {
  return (
    <AuthProvider>
      <YourRouter />
    </AuthProvider>
  );
}`;

export const UseAuthContextArticle: FC = () => {
  return (
    <article className="px-6 py-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        🔐 useAuth × Context で認証情報をアプリ全体に共有する方法
      </h1>

      <p className="mb-4">
        Firebase Authentication を使ってログイン状態やユーザー情報を
        <strong className="text-blue-400">アプリ全体で管理・参照</strong>
        したい場合、ReactのContextとカスタムフックの組み合わせが最もシンプルかつ強力です。
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">
        1. useAuth.tsx の実装全文
      </h2>
      <SyntaxHighlighter language="tsx" style={oneDark} wrapLongLines>
        {useAuthCode}
      </SyntaxHighlighter>

      <h2 className="text-2xl font-semibold mt-8 mb-2">
        2. 各セクションの解説（コード付き）
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-1">
        1. Contextの定義と初期値
      </h3>
      <p className="mb-2">
        認証状態をアプリ全体で共有するために{" "}
        <code className="text-yellow-300">createContext()</code> を使用。
        初期値を設定しておくことで、Context外で呼ばれた場合の型エラーや null
        例外を防ぎます。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
});`}
      </SyntaxHighlighter>

      <h3 className="text-xl font-semibold mt-6 mb-1">
        2. カスタムフック useAuth()
      </h3>
      <p className="mb-2">
        Contextの中身を取り出す処理をラップし、任意のコンポーネントから簡単に呼び出せるようにします。
        このおかげで、どこでも{" "}
        <code className="text-yellow-300">
          const &#123; currentUser &#125; = useAuth();
        </code>{" "}
        が使えるようになります。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`export const useAuth = () => useContext(AuthContext);`}
      </SyntaxHighlighter>

      <h3 className="text-xl font-semibold mt-6 mb-1">
        3. AuthProviderでFirebaseの認証状態を監視
      </h3>
      <p className="mb-2">
        Firebaseの <code className="text-yellow-300">onAuthStateChanged()</code>{" "}
        を <code>useEffect</code> で呼び出すことで、
        ユーザーのログイン状態をリアルタイムに検出・反映します。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);`}
      </SyntaxHighlighter>

      <h3 className="text-xl font-semibold mt-6 mb-1">4. loadingの扱い</h3>
      <p className="mb-2">
        Firebaseからの応答を待つ間、ローディング状態を true にしておき、
        状態が確定するまでは子コンポーネント（children）を描画しないようにします。
        これにより「未ログインでもページが一瞬見えてしまう」などの不具合を防げます。
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`return (
  <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
);`}
      </SyntaxHighlighter>

      <h2 className="text-2xl font-semibold mt-8 mb-2">
        3. context/index.ts でまとめる
      </h2>
      <p className="mb-2">
        インポートの簡略化・構造の見通しをよくするため、以下のようにエクスポートを整理します：
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {indexTsCode}
      </SyntaxHighlighter>

      <h2 className="text-2xl font-semibold mt-8 mb-2">
        4. 認証状態に応じた表示切り替え
      </h2>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {usageCode}
      </SyntaxHighlighter>

      <h2 className="text-2xl font-semibold mt-8 mb-2">
        5. App.tsx にProviderを配置
      </h2>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {appWrapCode}
      </SyntaxHighlighter>

      <p className="mt-6">
        以上の構成で、Reactアプリにおける Firebase
        認証のグローバルな状態管理が完了します。
        次はログイン・ログアウト関数、管理者権限のチェックなどもこのContextに組み込むことでさらに発展できます。
      </p>
      <Link to="/tech">
        <p className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </article>
  );
};
