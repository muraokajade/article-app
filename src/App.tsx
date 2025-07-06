import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./CommonPage/components/Navbar";
import { Footer } from "./CommonPage/components/Footer";

import { Home } from "./pages/HomePage/components/Home";
import { TechList } from "./pages/TeckListPage/TechKList";
import { TechDetail } from "./pages/TeckListPage/components/TechDetail";
import { SyntaxGuide } from "./pages/HomePage/components/SyntaxGuid";

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
