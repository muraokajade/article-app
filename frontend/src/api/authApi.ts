import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../libs/firebase";

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    console.log("ID Token:", token); // サーバーへ送るならここ
    return userCredential.user;
  } catch (error) {
    console.error("ログイン失敗", error);
    throw error;
  }
};
