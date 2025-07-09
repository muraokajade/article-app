# Firebase Authentication × React：管理者権限（admin claims）を使って管理画面を制御する方法

## 🧱 構成概要

### 1. なぜ「admin claims」が必要なのか？
- Firebaseの認証だけでは「誰が管理者か？」までは区別できない
- 記事投稿や削除など、操作権限を制限したいケースで必要
- FirebaseのCustom Claims機能を使えば、任意の属性（admin: trueなど）をユーザーに追加可能

### 2. Firebase Admin SDK を使って管理者権限を付与する
- Firebase プロジェクト
- Service Account Key（`serviceAccountKey.json`）
- Node.js 実行環境

### 3. 秘密鍵の取得
- [Firebase Console](https://console.firebase.google.com)
- →Your Project
- →Firebase Authentication
- →プロジェクト設定(左上歯車)
- →サービスアカウントタブ

![Firebase秘密鍵の取得画面](/assets/images/firebase-key.png)

- **ファイル名:** Service Account Key（`serviceAccountKey.json`）

### 4. スクリプトの実行

以下は実際のNode.jsスクリプト例です：

```javascript
const admin = require("firebase-admin");
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
    console.log(`✅ Admin claim has been set for UID: ${uid}`);
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Error setting admin claim:", error);
    process.exit(1);
  });
```
上記スクリプトを setAdminClaim.js として保存後、以下で実行：
node firebase-admin-script/setAdminClaim.js
実行が成功すれば、対象ユーザーに admin: true が設定され、
Firebase Authentication のユーザープロファイルに Custom Claims として追加されます。5. Reactで管理者かどうかを判定する（Custom Claimsの取得）
認証済みユーザーに対して admin判定(isAdmin) を確認することで、管理者かどうかをフロントで判定できます。
判定はContext で管理しています。 詳しくは AuthContext の実装解説記事 を参照してください。
そこでは onAuthStateChanged でログイン状態を監視し、getIdTokenResult() によって管理者判定を行う方法を詳しく説明しています。
実装しているファイル例: src/context/AuthContext.tsx
AuthContext.tsx(参考記事)
※次に、Spring Boot × Firebase Authentication：管理者権限をJWTから判定してAPIを制御する方法。に進んでください
