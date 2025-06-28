import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, logout,isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error("ログアウト失敗", e);
    }
  };

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
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Love Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                {" "}
                ホーム
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                {" "}
                本を探す
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/shelf">
                  {" "}
                  本棚
                </NavLink>
              </li>
            )}
            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  {" "}
                  管理者専用
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item m-1">
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  ログアウト
                </button>
              </li>
            ) : (
              <li className="nav-item m-1">
                <Link
                  type="button"
                  className="btn btn-outline-light"
                  to="/login"
                >
                  ログイン
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
