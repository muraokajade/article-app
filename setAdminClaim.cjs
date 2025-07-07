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

// ③ admin: true を付与
const uid = "9KXRCyWk4HTvCvVUNO6QQaJmlQE2"; // ← ここはあなたのUIDに置き換え

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
