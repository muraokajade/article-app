// src/pages/LoginPage.tsx
import { useState } from "react";
import { login } from "../../api/authApi";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      console.error("ログインエラー", e);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>メールアドレス</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            required
            
          />
        </div>
        <div className="mb-3">
          <label>パスワード</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
