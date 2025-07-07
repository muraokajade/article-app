import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./pages/components/Navbar";
import { Footer } from "./pages/components/Footer";

import { Home } from "./pages/HomePage/components/Home";
import { TechList } from "./pages/TeckListPage/TechKList";
import { TechDetail } from "./pages/TeckListPage/components/TechDetail";
import { SyntaxGuide } from "./pages/HomePage/components/SyntaxGuid";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import AdminRoute from "./routes/AdminRoutes";
import { AdminPage } from "./pages/AdminPage/AdminPage";

export default function App() {
  return (
    <Router>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
