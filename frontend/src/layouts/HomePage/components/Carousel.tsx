import { useEffect, useState } from "react";
import { ReturnBook } from "./ReturnBook";
import BookModel from "../../../models/BookModel";

export const Carousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);

  // 初回レンダリング時に書籍一覧を取得
  useEffect(() => {
    /**
     * 書籍APIから全件取得し、BookModel[] に変換してstateに保存する
     */
    const fetchBooks = async () => {
      const url = `/api/books?page=0&size=12`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("書籍取得失敗");
      const data = await res.json();
      console.log(data);

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
    };
    fetchBooks();
  }, []);

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 
                d-none d-lg-block"
        data-bs-interval="false"
      >
        {/* Desktop */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(0, 3).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(4, 7).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(8, 11).map((book) => (
                <ReturnBook key={book.id} book={book} />
              ))}
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="text-center">
            <img
              src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
              width="151"
              height="233"
              alt="book"
            />
            <h6 className="mt-2">Book</h6>
            <p>Luv2Code</p>
            <a className="btn main-color text-white" href="#">
              Reserve
            </a>
          </div>
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <a className="btn btn-outline-secondary btn-lg" href="#">
          View More
        </a>
      </div>
    </div>
  );
};
