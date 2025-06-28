import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SearchBook } from "./components/SearchBook";
import { Pagenation } from "./components/Pagenation";
import { usePagination } from "../../hooks/usePagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const { displayPage, setDisplayPage, pageIndex } = usePagination();
  const [totalPages, setTotalPages] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  const [activeCategory, setActiveCategory] = useState("All"); // ← API用ロジック判定に使う
  const [selectedCategory, setSelectedCategory] = useState("Category"); // ← 表示用

  const [totalElements, setTotalElements] = useState(0);

  // ---カテゴリリストをオブジェクトで定義 ---
  const categories = [
    { label: "Front End", value: "FE" },
    { label: "Back End", value: "BE" },
    { label: "Data", value: "Data" },
    { label: "DevOps", value: "DevOps" },
  ];

  const handleCategorySelect = (value: string, label: string) => {
    setDisplayPage(1);
    setActiveCategory(value); // ← これがAPI呼び出しなどで使われる
    setSelectedCategory(label); // ← 表示名として保持
    setSubmittedKeyword(""); // ← キーワード検索を解除
  };

  
  useEffect(() => {
    const fetchBooks = async () => {
      let url = "";
      const baseUrl = "/api/books";

      if (submittedKeyword) {
        // タイトル検索
        url = `${baseUrl}/search/title?title=${submittedKeyword}&page=${pageIndex}&size=5`;
      } else if (activeCategory !== "All") {
        // カテゴリ検索
        url = `${baseUrl}/search/category?category=${activeCategory}&page=${pageIndex}&size=5`;
      } else {
        // 通常の全件取得
        url = `${baseUrl}?page=${pageIndex}&size=5`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("データ取得失敗");

      const data = await res.json();
      const loadedData: BookModel[] = data.books.map(
        (item: any) =>
          new BookModel(
            item.id,
            item.title,
            item.author,
            item.description,
            item.copies,
            item.copiesAvailable,
            item.category,
            item.img
          )
      );
      setBooks(loadedData);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements); // ← 追加
      setIsLoading(false);
    };

    fetchBooks().catch((err) => {
      setHttpError(err.message);
      setIsLoading(false);
    });
  }, [submittedKeyword, activeCategory, pageIndex]);

  //ここのロジックが分からない
  const startItem = pageIndex * 5 + 1;
  const endItem = Math.min((pageIndex + 1) * 5, totalElements);

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    setSubmittedKeyword(searchKeyword);
                    setDisplayPage(1);
                  }}
                >
                  検索
                </button>
              </div>
            </div>

            {/* カテゴリ選択 */}
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory}
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleCategorySelect("All", "Category")}
                    >
                      All
                    </button>
                  </li>
                  {categories.map(({ label, value }) => (
                    <li key={value}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCategorySelect(value, label)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <h5>Number of results: ({totalElements})</h5>
          <p>
            {startItem} to {endItem} of {totalElements} items:
          </p>

          {/* 本の一覧 */}
          <div>
            {books.map((book) => (
              <SearchBook book={book} key={book.id} />
            ))}
          </div>
        </div>

        {/* ページネーション */}
        {totalPages > 0 && books.length > 0 && (
          <Pagenation
            displayPage={displayPage}
            totalPages={totalPages}
            paginate={(page) => setDisplayPage(page)}
            maxPageLinks={5}
          />
        )}
      </div>
    </div>
  );
};
