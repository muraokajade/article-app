import { Navbar } from "../components/Navbar";

import { Footer } from "../components/Footer";
import { Home } from "../HomePage/components/Home";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
};
