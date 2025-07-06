import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../libs/firebase"; // Firebase初期化済みのappをimport

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
});

// Contextを使いやすくするHook
export const useAuth = () => useContext(AuthContext);

// Contextに値を提供するProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //これによって、どの子コンポーネントでも useAuth() でこの情報を取得できるようになります。
  const value: AuthContextType = {
    currentUser,// FirebaseのUserオブジェクト（ログインしていれば入る）
    isAuthenticated: !!currentUser, // ← ここ重要！（nullでfalse、ユーザーありでtrue）
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
