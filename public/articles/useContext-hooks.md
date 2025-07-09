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
```
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
5. App.tsx にProviderを配置

```tsx
// App.tsx
import { AuthProvider } from "@/context";

function App() {
  return (
    <AuthProvider>
      <YourRouter />
    </AuthProvider>
  );
}
```
以上の構成で、Reactアプリにおける Firebase 認証のグローバルな状態管理が完了します。
次はログイン・ログアウト関数、管理者権限のチェックなどもこのContextに組み込むことでさらに発展できます。

