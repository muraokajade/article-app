//フロント側：JWTに含まれるクレームを確認（React）
import { useEffect } from "react";
import {auth}
import { getIdTokenResult } from "firebase/auth";
  
  useEffect(() => {
    const fetchClaims = async () => {
      const user = auth.currentUser;
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        console.log("✅ Firebase claims:", tokenResult.claims);
      } else {
        console.log("⚠️ ユーザー未ログイン");
      }
    };

    fetchClaims();
  }, []);