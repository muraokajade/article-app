import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../../CommonPage/components/Navbar";

import { Footer } from "../../CommonPage/components/Footer";
import { Home } from "./components/Home";
import { TechList } from "./components/TechKist";
import { SyntaxGuide } from "./components/SyntaxGuid";


export const HomePage = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tech" element={<TechList />} />
            <Route path="/basics" element={<SyntaxGuide />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
