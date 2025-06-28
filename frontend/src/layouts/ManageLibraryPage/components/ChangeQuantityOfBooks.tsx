import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { usePagination } from "../../../hooks/usePagination";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Pagenation } from "../../SearchBooksPage/components/Pagenation";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const { displayPage, pageIndex, setDisplayPage } = usePagination();

  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [bookDelete, setBookDelete] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const url = `/api/books?page=${pageIndex}&size=5`;

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
      setTotalAmountOfBooks(data.totalElements); // ← 追加
      setIsLoading(false);
    };

    fetchBooks().catch((err) => {
      setHttpError(err.message);
      setIsLoading(false);
    });
  }, [pageIndex,bookDelete]);

  const indexOfLastBook: number = displayPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * displayPage <= totalAmountOfBooks
      ? booksPerPage * displayPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setDisplayPage(pageNumber);

  const deleteBook = () => setBookDelete(!bookDelete);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {totalAmountOfBooks > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({totalAmountOfBooks})</h3>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>
          {books.map((book) => (
            <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
      )}
      {totalPages > 1 && (
        <Pagenation
          displayPage={displayPage}
          maxPageLinks={5}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
