# 🔐 useAuth × Context で認証情報をアプリ全体に共有する方法

Firebase Authentication を使ってログイン状態やユーザー情報を  
**アプリ全体で管理・参照**したい場合、ReactのContextとカスタムフックの組み合わせが最もシンプルかつ強力です。

---

## 1. useAuth.tsx の実装全文

```tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../libs/firebase"; // Firebase初期化済みのappをimport

// 認証情報（ユーザー、認証状態、管理者か等）を保持する型を定義
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  idToken: string | null;
  isAdmin: boolean;
}
// AuthContextを作成し、初期値（未ログイン状態）を設定
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  idToken: null,
  isAdmin: false,
});

//useContext(AuthContext) をラップし、どこからでも認証状態を呼び出せるようにする。
export const useAuth = () => useContext(AuthContext);

// 「ログイン状態」や「ユーザー情報」をグローバルに使い回すためのProviderです。
// アプリ全体を <AuthProvider>〜</AuthProvider> で囲んで使うことで、
// どこでも認証情報が参照できるようになります。
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
      setCurrentUser(firebaseuser);
      if (firebaseuser) {
        const token = await firebaseuser.getIdToken();
        setIdToken(token);
        const tokenResult = await firebaseuser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Contextで管理する認証情報をまとめたオブジェクトを作成
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
};
```
2. 各セクションの解説（コード付き）

1. Contextの定義と初期値
認証状態をアプリ全体で共有するために createContext() を使用します。
初期値を設定しておくことで、Context外で呼ばれた場合の型エラーや null 例外を防げます。

```tsx 
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  idToken: null,
  isAdmin: false
});
```
2. カスタムフック useAuth()
Contextの中身を取り出す処理をラップし、任意のコンポーネントから簡単に呼び出せるようにします。
```tsx
export const useAuth = () => useContext(AuthContext);
const { isAuthenticated, idToken, isAdmin, currentUser } = useAuth();
```
3. AuthProviderでFirebaseの認証状態を監視

Firebaseの onAuthStateChanged() を useEffect で呼び出すことで、
ユーザーのログイン状態をリアルタイムに検出・反映します。
同時にAPI認証時に使うトークンも取得します。
user.getIdToken() でJWTも取得し、管理者判定はカスタムクレーム（admin）で行います。


```tsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
    setCurrentUser(firebaseuser);
    if (firebaseuser) {
      const token = await firebaseuser.getIdToken();
      setIdToken(token);
      const tokenResult = await firebaseuser.getIdTokenResult();
      setIsAdmin(tokenResult.claims.admin === true);
    } else {
      setIdToken(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);
```
重要！！！上記コードの注意点(userについて)。後々DBと連携した時にDBのuserなのかfirebase認証のuserなのか混乱するので、命名はしっかり分けるのを推奨。
ここではfirebase認証でのuserです。
【結論】
今のファイルは「Firebase認証でのUser」専用。
DBユーザーや他のユーザー定義が出てきた時は、名前と型でしっかり分けるべし！です。

4. loadingの扱い

Firebaseからの応答を待つ間、ローディング状態を true にしておき、
状態が確定するまでは子コンポーネント（children）を描画しないようにします。

```tsx
return (
  <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
);
```
4. 認証状態に応じた表示切り替え（利用例）

必要なContextを読み込む（useAuthはContextの値を取り出すカスタムHook）

```tsx
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
};
```
5. index.tsx にProviderを配置

```tsx
// index.tsx
import { AuthProvider } from "@/context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```
以上の構成で、Reactアプリにおける Firebase 認証のグローバルな状態管理が完了します。
次はログイン・ログアウト関数、管理者権限のチェックなどもこのContextに組み込むことでさらに発展できます。

