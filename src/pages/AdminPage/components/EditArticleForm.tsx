import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export const EditArticleForm = () => {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { idToken, loading } = useAuth();


  return (
    <form className="mb-6 space-y-4">
      <input
        className="w-full text-black border p-2"
        value={slug}
        placeholder="スラッグ（URL識別子）"
      />
      <input
        className="w-full text-black border p-2"
        value={title}
        placeholder="タイトル"
      />
      <input
        className="w-full text-black border p-2"
        value={sectionTitle}
        placeholder="セクションタイトル"
      />
      <textarea
        className="w-full text-black border p-2"
        value={content}
        placeholder="内容"
        rows={6}
      />
      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            console.log("📁 選択したファイル:", e.target.files[0]);
            setImageFile(e.target.files[0]);
          }
        }}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        編集
      </button>
    </form>
  );
};
