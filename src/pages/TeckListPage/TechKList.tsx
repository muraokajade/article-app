import { useState } from "react";
import { Link } from "react-router-dom";
import techData from "../../data/techData.json";
interface TechItem {
  title: string;
  category: string;
  slug: string;
  thumbnail: string;
}

export const TechList = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Spring", "React", "Vue", "Firebase", "Tailwind"];

  const filtered = (techData as TechItem[]).filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || item.category === selectedCategory)
  );

  // カテゴリ別にグループ化
  const grouped = categories.map((cat) => ({
    category: cat,
    items: filtered.filter((item) => item.category === cat),
  }));

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">技術スタック一覧</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="検索ワードを入力"
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring focus:border-blue-500 w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring focus:border-blue-500 text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">すべてのカテゴリ</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* グループごとに表示 */}
      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <div key={group.category} className="mb-8">
              <h2 className="text-2xl font-bold mb-2 border-b border-gray-600 pb-1">
                {group.category}
              </h2>
              <ul className="space-y-2">
                {group.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={`/articles/${item.slug}`}
                      className="block p-4 rounded bg-gray-800 hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="text-lg">{item.title}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
};
