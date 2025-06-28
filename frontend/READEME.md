## 🔐 Firebase Authentication × Spring Boot 認証・認可構成

本プロジェクトでは、フロントエンド（React）とバックエンド（Spring Boot）の間で、Firebase Authentication の ID トークンを用いた認証・認可を実装しています。

---

### ✅ 認証方式の構成概要

| 項目 | 内容 |
|------|------|
| 認証基盤 | Firebase Authentication（Email/Password） |
| トークン取得 | React: `getIdToken()`（ログイン後） |
| 認証ヘッダー | `Authorization: Bearer <token>` |
| サーバー側検証 | Spring Boot + Firebase Admin SDK による `verifyIdToken()` |
| 権限管理 | Firebase カスタムクレーム（例: `admin: true`） |
| 認可判断 | Java: `decodedToken.getClaims().get("admin")` |

---

### 🔁 認証フロー図

```text
[React Frontend]
  ↓ getIdToken()
Authorization: Bearer <JWT>
  ↓
[Spring Boot API]
  ↓
FirebaseAuth.verifyIdToken(token)
  ↓
check decodedToken.getClaims().get("admin")
  ↓
403 Forbidden or 処理実行


## 🛠️ トラブルシューティングガイド

### ✅ よくあるエラーとその原因

| HTTPステータス | 主な原因 | デバッグのヒント |
|----------------|----------|------------------|
| `401 Unauthorized` | 認証失敗 / トークン不備 / Firebaseクレーム不足 | `e.printStackTrace()` や `FirebaseAuth.getInstance().verifyIdToken()` の結果を確認 |
| `403 Forbidden` | 認可失敗（例：`admin` 権限なし） | `decodedToken.getClaims().get("admin")` の値を検証 |
| `500 Internal Server Error` | Repositoryが`null` / Beanの依存注入失敗 / `@Query`構文エラー | スタックトレースで `NullPointerException` や `Could not create query` を探す |
| `400 Bad Request` | リクエストの形式エラー / JSON構造ミスマッチ | `@RequestBody`やDTOのプロパティの不一致を確認 |

---

### 🔍 実際のケースとその対応策

#### ケース1：Repositoryが `null` → NPE発生

```java
java.lang.NullPointerException: Cannot invoke "CheckoutRepository.deleteAllByBookId()" because "this.checkoutRepository" is null
