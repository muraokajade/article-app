const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 自分のダウンロードした認証キー

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "9KXRCyWk4HTvCvVUNO6QQaJmlQE2"; // Firebase Authentication で取得可能な 管理者にしたいFirebaseユーザーのUID

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ 管理者権限が付与されました（UID: ${uid}）`);
  })
  .catch((error) => {
    console.error("❌ エラーが発生:", error);
  });
