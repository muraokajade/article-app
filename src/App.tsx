import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./pages/CommonPage/components/Navbar";
import { Footer } from "./pages/CommonPage/components/Footer";

import { Home } from "./pages/HomePage/components/Home";
import { TechList } from "./pages/TeckListPage/TechKList";
import { TechDetail } from "./pages/TeckListPage/components/TechDetail";
import { SyntaxGuide } from "./pages/HomePage/components/SyntaxGuid";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import AdminRoute from "./routes/AdminRoutes";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { FirebaseOverview } from "./pages/ArticleExplanation/components/FirebaseOverview";
import { FirebaseAdminFlow } from "./pages/ArticleExplanation/FirebaseAdminFlow"; 
import { UseAuthContextArticle } from "./pages/ArticleExplanation/components/UseAuthContextArticle";
import { SpringFirebaseFlow } from "./pages/ArticleExplanation/components/SpringFirebaseFlow";
import { DoFilterExplanation } from "./pages/ArticleExplanation/components/DoFilterExplanation";
import { MethodSecurityBasics } from "./pages/ArticleExplanation/components/MethodSecurityBasics";
import { EditArticleFlowSpring } from "./pages/ArticleExplanation/components/EditArticleFlowSpring";
import { EditArticleFlowReact } from "./pages/ArticleExplanation/components/EditArticleFlowReact";
import { DeleteArticleFlow } from "./pages/ArticleExplanation/components/DeleteArticleFlow";

export default function App() {
  return (
    <Router>
      <div className="App"></div>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tech" element={<TechList />} />
            <Route path="/tech/:slug" element={<TechDetail />} />
            <Route path="/basics" element={<SyntaxGuide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="/articles/firebase-overview"
              element={<FirebaseOverview />}
            />
            <Route
              path="/articles/admin-claims-firebase"
              element={<FirebaseAdminFlow />}
            />
            <Route
              path="/articles/useContext-hooks"
              element={<UseAuthContextArticle />}
            />
            <Route
              path="/articles/spring-jwt-auth"
              element={<SpringFirebaseFlow />}
            />
            <Route
              path="/articles/do-filter-explanation"
              element={<DoFilterExplanation />}
            />
            <Route
              path="/articles/method-security-basics"
              element={<MethodSecurityBasics />}
            />
            <Route
              path="/articles/article-edit-spring"
              element={<EditArticleFlowSpring />}
            />
            <Route
              path="/articles/article-edit-react"
              element={<EditArticleFlowReact />}
            />
            <Route
              path="/articles/delete-article"
              element={<DeleteArticleFlow />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
