import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const FirebaseOverview = () => {
  const jwtCode = `import { getAuth } from "firebase/auth";

const auth = getAuth();
const token = await auth.currentUser?.getIdToken();

axios.get("/api/secure-data", {
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});`;
  const code1 = `
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebaseコンソールから取得した設定値
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebaseアプリを初期化コード
const app = initializeApp(firebaseConfig);

// Firebase Authenticationインスタンスを取得
export const auth = getAuth(app);
`;

  const code2 = `import { auth } from "../firebase"; // ← これで firebase.ts が読み込まれて初期化される

import { signInWithEmailAndPassword } from "firebase/auth";

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("ログイン成功:", userCredential.user);
  } catch (error) {
    console.error("ログイン失敗:", error);
  }
}; `;
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">🔐 Firebase認証の全体像</h1>

      {/* 概要 */}
      <h2 className="text-2xl font-semibold mb-2">
        1. Firebase Authenticationの概要
      </h2>
      <p className="mb-4">
        Firebase Authenticationは、Googleが提供する認証基盤であり、 React +
        Spring
        Bootアプリにおいて「ユーザー認証・保護されたAPI通信」に必要不可欠な仕組みです。
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        📌 対応するログイン手段
      </h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Email/Password</li>
        <li>Google認証（OAuth）</li>
        <li>GitHub, Facebook, Twitterなどの連携</li>
        <li>匿名ログイン</li>
      </ul>
      <p className="mb-6">
        今回は最も基本的な「Email/Password」による認証を使用します。
      </p>

      {/* フロー */}
      <h2 className="text-2xl font-semibold mb-2">
        2. Reactアプリでの認証フロー
      </h2>
      <ol className="list-decimal ml-6 mb-6 space-y-1">
        <li>Firebaseの初期化（firebase.ts）</li>
        <SyntaxHighlighter language="typescript" style={oneDark}>
          {code1}
        </SyntaxHighlighter>
        <li>ユーザーがログイン（例：LoginPage）</li>
        <SyntaxHighlighter language="typescript" style={oneDark}>
          {code2}
        </SyntaxHighlighter>
        <li>FirebaseがJWT（IDトークン）を発行</li>
        <li>getIdToken() で取得し、Spring BootのAPIへ送信</li>
      </ol>

      {/* JWTの取得コード */}
      <h2 className="text-2xl font-semibold mb-2">
        3. JWTの取得とaxiosへのセット
      </h2>
      <SyntaxHighlighter
        language="javascript"
        style={oneDark}
        className="rounded-md mb-6"
      >
        {jwtCode}
      </SyntaxHighlighter>

      <p>
        React側では、ログイン後にこのようにしてトークンを取得し、axiosなどでAPIに付与します。
        <br />
        `getIdToken()`
        は非同期関数で、ログイン済みユーザーが持っているJWTを取得します。
        <br />
        このJWTをAPIのAuthorizationヘッダーに含めることで、Spring
        Boot側でユーザーを認証できます。
      </p>
      <Link to="/tech">
        <p className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>

    </div>
  );
};
