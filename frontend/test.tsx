//Step 1: キーワード検索トリガーとボタン処理を追加
<input
  className="form-control me-2"
  type="search"
  placeholder="Search"
  aria-labelledby="Search"
  value={searchKeyword}
  onChange={(e) => setSearchKeyword(e.target.value)}
/>
<button
  className="btn btn-outline-success"
  onClick={() => {
    setDisplayPage(1);
    setSubmittedKeyword(searchKeyword);
    setActiveCategory("Category"); // ←カテゴリ検索解除
  }}
>
  Search
</button>


Step 2: カテゴリ選択処理の追加
ドロップダウンの各項目に以下のようにする：

<a
  className="dropdown-item"
  href="#"
  onClick={() => {
    setActiveCategory("FE"); // ←ここにAPI用カテゴリ値（BE、Dataなど）
    setSelectedCategory("Front End"); // ←表示用
    setSubmittedKeyword(""); // ←キーワード検索解除
    setDisplayPage(1); // ←最初のページに戻す
  }}
>
  Front End
</a>

✅ Step 3: 条件によってfetch先を切り替える

useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl = "http://localhost:8080/api/books";
      let url = "";
  
      if (submittedKeyword) {
        url = `${baseUrl}/search/findByTitleContaining?title=${submittedKeyword}&page=${pageIndex}&size=5`;
      } else if (activeCategory !== "Category" && activeCategory !== "All") {
        url = `${baseUrl}/search/findByCategory?category=${activeCategory}&page=${pageIndex}&size=5`;
      } else {
        url = `${baseUrl}?page=${pageIndex}&size=5`;
      }
  
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch error");
  
        const data = await res.json();
        const loadedData: BookModel[] = data.books.map((item: any) => new BookModel(
          item.id,
          item.title,
          item.author,
          item.description,
          item.copies,
          item.copiesAvailable,
          item.category,
          item.img
        ));
        setBooks(loadedData);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };
  
    fetchBooks();
    window.scrollTo(0, 0);
  }, [pageIndex, submittedKeyword, activeCategory]);

  
  