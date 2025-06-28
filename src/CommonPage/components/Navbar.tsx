import { Link } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        {/* 左：ロゴ */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-wide"
        >
          <span className="text-blue-400">Dev</span>
          <span className="text-white">Nav</span>
          <span className="text-blue-600">+</span>
        </Link>

        {/* モバイル：ハンバーガーボタン */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* 中央：リンク（PCのみ表示） */}
        <div className="hidden md:flex space-x-6">
          <Link to="/tech" className="text-white hover:text-blue-300">
            技術スタック
          </Link>
          <Link to="/basics" className="text-white hover:text-blue-300">
            基本文法
          </Link>
        </div>

        {/* 右：ログイン */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ログイン
          </Link>
        </div>
      </div>

      {/* モバイルメニュー（開閉） */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          <Link to="/tech" className="block text-white hover:text-blue-300">
            技術スタック
          </Link>
          <Link to="/basics" className="block text-white hover:text-blue-300">
            基本文法
          </Link>
          <Link
            to="/login"
            className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ログイン
          </Link>
        </div>
      )}
    </nav>
  );
};
