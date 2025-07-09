# 🔐 Firebase認証の全体像

## 1. Firebase Authenticationの概要

Firebase Authenticationは、Googleが提供する認証基盤であり、React + Spring Bootアプリにおいて「ユーザー認証・保護されたAPI通信」に必要不可欠な仕組みです。

## 📌 対応するログイン手段

- Email/Password
- Google認証（OAuth）
- GitHub, Facebook, Twitterなどの連携
- 匿名ログイン

今回は最も基本的な「Email/Password」による認証を使用します。

## 2. Reactアプリでの認証フロー

1. Firebaseの初期化（firebase.ts）

```typescript
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
```

2. ユーザーがログイン（例：LoginPage）

```typescript
import { auth } from "../firebase"; // ← これで firebase.ts が読み込まれて初期化される

import { signInWithEmailAndPassword } from "firebase/auth";

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("ログイン成功:", userCredential.user);
  } catch (error) {
    console.error("ログイン失敗:", error);
  }
};
```
3. FirebaseがJWT（IDトークン）を発行 
4. getIdToken() で取得し、Spring BootのAPIへ送信

```typescript
import { getAuth } from "firebase/auth";

const auth = getAuth();
const token = await auth.currentUser?.getIdToken();

axios.get("/api/secure-data", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```
React側では、ログイン後にこのようにしてトークンを取得し、axiosなどでAPIに付与します。
getIdToken() は非同期関数で、ログイン済みユーザーが持っているJWTを取得します。
このJWTをAPIのAuthorizationヘッダーに含めることで、Spring Boot側でユーザーを認証できます。
