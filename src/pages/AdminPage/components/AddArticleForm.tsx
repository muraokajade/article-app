import { useState } from "react";
import axios from "axios";

type Props = {
  onSuccess: () => void;
};

export const AddArticleForm = ({ onSuccess }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/article", { title, content });
      setTitle("");
      setContent("");
      onSuccess();
      alert("✅ 記事を投稿しました");
    } catch (err) {
      console.error("❌ 投稿失敗", err);
      alert("投稿に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <input
        className="w-full border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
      />
      <textarea
        className="w-full border p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
        rows={6}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        投稿
      </button>
    </form>
  );
};
