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
import { auth } from "../libs/firebase"; // Firebase初期化済みのappをimport

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  idToken: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  idToken: null,
  isAdmin: false,
});

// Contextを使いやすくするHook
export const useAuth = () => useContext(AuthContext);

// Contextに値を提供するProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //これによって、どの子コンポーネントでも useAuth() でこの情報を取得できるようになります。
  const value: AuthContextType = {
    currentUser, // FirebaseのUserオブジェクト（ログインしていれば入る）
    isAuthenticated: !!currentUser, // ← ここ重要！（nullでfalse、ユーザーありでtrue）
    loading,
    idToken,
    isAdmin
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};`;

const indexTsCode = `// src/context/index.ts
export { AuthProvider, useAuth } from "./useAuth";`;

const usageCode = `// 必要なContextを読み込む（useAuthはContextの値を取り出すカスタムHook）
import { useAuth } from "@/context";

const ProtectedComponent = () => {
  // Contextから認証に関する情報を取得
  const { isAuthenticated, loading, idToken, isAdmin } = useAuth();

  // Firebaseの認証状態がまだ確定していない（トークン取得中など）
  if (loading) return <p>確認中...（Loading...）</p>;

  // 認証されていない場合の表示
  if (!isAuthenticated) return <p>ログインが必要です。</p>;

  // 管理者専用ページにしたい場合は、ここで制御
  if (!isAdmin) return <p>管理者権限が必要です。</p>;

  // 認証・認可（isAdmin）が通った場合の表示内容
  return (
    <div>
      <h2>ようこそ、管理者ユーザー様！</h2>
      <p>このコンポーネントはログイン済ユーザーかつ管理者のみが表示可能です。</p>

      {/* 実際の処理に使うなら、idToken を使ってバックエンドAPIにアクセスなど */}
      <p>トークンを使って管理者向けのAPIにアクセスすることも可能です。</p>
    </div>
  );
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
  idToken: null,
  isAdmin: false
});`}
      </SyntaxHighlighter>

      <h3 className="text-xl font-semibold mt-6 mb-1">
        2. カスタムフック useAuth()
      </h3>
      <p className="mb-2">
        Contextの中身を取り出す処理をラップし、任意のコンポーネントから簡単に呼び出せるようにします。
        このおかげで、どこでも{" "}
        <code className="text-yellow-300">
          const &#123; isAuthenticated, idToken, , isAdmin, currentUser &#125; =
          useAuth();
        </code>{" "}
        が用途に応じて使えるようになります。
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
        同時にAPI認証時に使うトークンも取得します。
        <code className="text-yellow-300">user.getIdToken()</code>{" "}
        。FirebaseにログインしたユーザーのIDトークンに含まれるカスタムクレーム（ここではadmin）を取得し、trueであれば管理者と判定しています。別記事「[admin認証の仕組み（Firebase × React）]」で解説
      </p>
      <SyntaxHighlighter language="tsx" style={oneDark}>
        {`useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);
    if (user) {
      const token = await user.getIdToken();
      setIdToken(token);
      const tokenResult = await user.getIdTokenResult();
      setIsAdmin(tokenResult.claims.admin === true);
    } else {
      setIdToken(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);
`}
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
