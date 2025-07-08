import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import React from "react";
import { Link } from "react-router-dom";

export const FirebaseAdminFlow = () => {
  const nodeScript = `const admin = require("firebase-admin");
const fs = require("fs");

// ① 管理者の秘密鍵を読み込む
const serviceAccount = JSON.parse(
  fs.readFileSync("firebase-admin-script/serviceAccountKey.json", "utf8")
);

// ② Firebase Admin SDK 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ③ 対象ユーザーに admin: true を付与
const uid = "YOUR_UID_HERE"; // ← Firebase AuthのUIDに置き換え

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(\`✅ Admin claim has been set for UID: \${uid}\`);
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Error setting admin claim:", error);
    process.exit(1);
  });`;

  const runCommand = `node firebase-admin-script/setAdminClaim.js`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h2 className="text-3xl mb-4">
        Firebase Authentication × React：管理者権限（admin
        claims）を使って管理画面を制御する方法
      </h2>

      <h3 className="p-4 text-lg">🧱 構成概要</h3>

      <h4>1. なぜ「admin claims」が必要なのか？</h4>
      <ul>
        <li className="m-2">
          Firebaseの認証だけでは「誰が管理者か？」までは区別できない
        </li>
        <li className="m-2">
          記事投稿や削除など、操作権限を制限したいケースで必要
        </li>
        <li className="m-2">
          FirebaseのCustom Claims機能を使えば、任意の属性（admin:
          trueなど）をユーザーに追加可能
        </li>
      </ul>

      <h4 className="p-4 text-lg">
        2. Firebase Admin SDK を使って管理者権限を付与する
      </h4>
      <ul>
        <li className="m-2">Firebase プロジェクト</li>
        <li className="m-2">
          Service Account Key（<code>serviceAccountKey.json</code>）
        </li>
        <li className="m-2">Node.js 実行環境</li>
      </ul>

      <h4 className="p-4 text-lg">3. 秘密鍵の取得</h4>
      <ul>
        <li className="m-2">
          <a
            className="text-blue-500"
            href="https://console.firebase.google.com"
          >
            Firebase Console
          </a>
        </li>
        <li className="m-2">→Your Project</li>
        <li className="m-2">→Firebase Authentication</li>
        <li className="m-2">→プロジェクト設定(左上歯車)</li>
        <li className="m-2">→サービスアカウントタブ</li>
        <img
          src="/assets/images/firebase-key.png"
          alt="Firebase秘密鍵の取得画面"
        />
        <li className="m-2">
          <strong>ファイル名: </strong>Service Account Key（
          <code>serviceAccountKey.json</code>）
        </li>
        <li className="m-2">Node.js 実行環境</li>
      </ul>

      <h4 className="p-4 text-lg">3. スクリプトの実行</h4>

      <p>以下は実際のNode.jsスクリプト例です：</p>
      <SyntaxHighlighter language="javascript" style={oneDark}>
        {nodeScript}
      </SyntaxHighlighter>

      <p>
        上記スクリプトを <code>setAdminClaim.js</code>{" "}
        として保存後、以下で実行：
      </p>
      <SyntaxHighlighter language="bash" style={oneDark}>
        {runCommand}
      </SyntaxHighlighter>

      <p>
        実行が成功すれば、対象ユーザーに <code>admin: true</code> が設定され、
        Firebase Authentication のユーザープロファイルに Custom Claims
        として追加されます。
      </p>
      <h4 className="p-4 text-lg">
        4. Reactで管理者かどうかを判定する（Custom Claimsの取得）
      </h4>
      <p>
        認証済みユーザーに対して admin判定(isAdmin)
        を確認することで、管理者かどうかをフロントで判定できます。 判定はContext
        で管理しています。 詳しくは AuthContext の実装解説記事
        を参照してください。 そこでは onAuthStateChanged
        でログイン状態を監視し、getIdTokenResult()
        によって管理者判定を行う方法を詳しく説明しています。
        実装しているファイル例: src/context/AuthContext.tsx
      </p>

      <Link to="/articles/useContext-hooks">
        <p className="text-lg text-blue-400">AuthContext.tsx(参考記事)</p>
      </Link>

      <h4 className="text-xl p-4">※次に、Spring Boot × Firebase Authentication：管理者権限をJWTから判定してAPIを制御する方法。に進んでください</h4>

      <Link to="/tech">
        <p className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
