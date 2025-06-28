import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CheckoutAndReviewBox } from "./components/CheckoutAndReviewBox";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./components/LatestReview";
import { StarsReview } from "./components/StarsReview";
import { useBookReviews } from "../../hooks/useBookReviews";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isCheckedout, setIsCheckout] = useState(false);
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const { bookId } = useParams<{ bookId: string }>();
  const numericBookId = Number(bookId);

  //1.認証状態のチェック
  const { user, isAuthenticated, idToken, loading } = useAuth();
  console.log(idToken);

  //hookから必要情報取り出し
  const { averageRating, fetchReviews, reviews } = useBookReviews(
    numericBookId,
    loading,
    idToken ?? ""
  );

  // 本データ取得
  const fetchBook = async (id: number) => {
    try {
      const url = `/api/books/checkout?bookId=${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("本データ取得失敗");
      const data = await res.json();
      setBook(data);
    } catch (e: any) {
      console.error("fetch missed", e);
      setHttpError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(numericBookId)) {
      fetchBook(numericBookId);
    }
  }, [numericBookId]);

  useEffect(() => {
    const fetchcurrentLons = async () => {
      if (!idToken) return; // idToken が未取得なら中断
      const url = "/api/books/secure/currentloans/count";

      const headers = {
        Authorization: `Bearer ${idToken}`,
      };
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("貸出カウント取得失敗");
      const data = await res.json();

      setCurrentLoansCount(data);
    };
    fetchcurrentLons();
  }, [idToken]);

  useEffect(() => {
    const fetchIsCheckedOut = async () => {
      if (!idToken) return;

      try {
        const url = `/api/books/secure/ischeckout/byuser?bookId=${numericBookId}`;
        const headers = {
          Authorization: `Bearer ${idToken}`,
        };
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("貸出状態の取得失敗");

        const data = await res.json();
        // console.log(data);
        setIsCheckout(data); // true or false
      } catch (e: any) {
        console.error(e);
        setHttpError(e.message);
      }
    };

    fetchIsCheckedOut();
  }, [idToken, numericBookId]);

  //子に渡す
  const checkoutBook = async () => {
    if (loading) return;
    const url = `/api/books/secure/checkout?bookId=${numericBookId}`;

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("貸出失敗");

    setIsCheckout(true);
  };

  //レビュー存在するかどうか
  useEffect(() => {
    const isReviewLeft = async () => {
      if (loading) return;
      try {
        const url = `/api/reviews/secure/user/reviewed?bookId=${numericBookId}`;
        const headers = {
          Authorization: `Bearer ${idToken}`,
        };
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("レビュー状態の取得失敗");

        const data = await res.json();
        // console.log(data);
        setIsReviewLeft(data); // true or false
      } catch (e: any) {
        console.error(e);
        setHttpError(e.message);
      }
    };
    isReviewLeft();
  }, [idToken, numericBookId]);

  return (
    <div>
      {/* PC表示 */}
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-md-3">
            <img
              src={
                book?.img ??
                require("./../../Images/BooksImages/book-luv2code-1000.png")
              }
              width="226"
              height="349"
              alt="Book"
            />
          </div>
          <div className="col-md-5">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p
              className="lead text-wrap text-break"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {book?.description}
            </p>

            <StarsReview rating={averageRating} size={32} />
          </div>
          <div className="col-md-4">
            <CheckoutAndReviewBox
              book={book}
              currentLoansCount={currentLoansCount}
              isAuthenticated={isAuthenticated}
              isCheckedout={isCheckedout}
              checkoutBook={checkoutBook}
              isReviewLeft={isReviewLeft}
              fetchReviews={fetchReviews}
              setIsReviewLeft={setIsReviewLeft}
            />
          </div>
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>

      {/* モバイル表示 */}
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center">
          <img
            src={
              book?.img ??
              require("./../../Images/BooksImages/book-luv2code-1000.png")
            }
            width="226"
            height="349"
            alt="Book"
          />
        </div>
        <div className="mt-4">
          <h2>{book?.title}</h2>
          <h5 className="text-primary">{book?.author}</h5>
          <p className="lead">{book?.description}</p>
          <StarsReview rating={averageRating} size={32} />
        </div>
        <CheckoutAndReviewBox
          book={book}
          isAuthenticated={isAuthenticated}
          currentLoansCount={currentLoansCount}
          isCheckedout={isCheckedout}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          fetchReviews={fetchReviews}
          setIsReviewLeft={setIsReviewLeft}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={numericBookId} mobile={true} />
      </div>
    </div>
  );
};
