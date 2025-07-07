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
  loading: boolean
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  idToken: null
});

// Contextを使いやすくするHook
export const useAuth = () => useContext(AuthContext);

// Contextに値を提供するProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      setCurrentUser(user);
      if(user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //これによって、どの子コンポーネントでも useAuth() でこの情報を取得できるようになります。
  const value: AuthContextType = {
    currentUser,// FirebaseのUserオブジェクト（ログインしていれば入る）
    isAuthenticated: !!currentUser, // ← ここ重要！（nullでfalse、ユーザーありでtrue）
    loading,
    idToken
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
