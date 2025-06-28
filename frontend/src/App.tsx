import React from "react";

import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import LoginPage from "./layouts/HomePage/LoginPage";
import { ReviewListPage } from "./layouts/BookCheckoutPage/components/ReviewListPage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchBooksPage />} />
        <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reviewlist/:bookId" element={<ReviewListPage />} />
        <Route
          path="/shelf"
          element={
            <PrivateRoute>
              <ShelfPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <ManageLibraryPage/>
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};
