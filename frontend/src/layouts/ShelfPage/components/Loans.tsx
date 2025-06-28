import { use, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  const { isAuthenticated, idToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Current Loans
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {
      if (isAuthenticated && idToken) {
        try {
          const url = "/api/books/secure/currentloans";
          const options = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          };
          const res = await fetch(url, options);
          console.log("✅ ステータス:", res.status);
          if (!res.ok) throw new Error("貸出情報取得失敗");
          const data = await res.json();
          console.log(data);

          setShelfCurrentLoans(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingUserLoans(false);
        }
      }
    };
    fetchUserCurrentLoans();
  }, [isAuthenticated, idToken, checkout]);

  if (isLoadingUserLoans) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div>
        <p>{httpError}</p>
      </div>
    );
  }

  async function returnBook(bookId: number) {
    const url = `/api/books/secure/return?bookId=${bookId}`;

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = await fetch(url, options);
    if (!res.ok) {
      const errorText = await res.text(); // サーバーからの詳細メッセージ
      console.error("返却失敗:", errorText);
      throw new Error(errorText || "本返却失敗");
    }

    setTimeout(() => {
      setCheckout(!checkout);
    }, 400); // 0.4秒だけ待つ（必要に応じて調整）
  }

  async function renewBook(bookId: number) {
    if (isAuthenticated && idToken) {
      try {
        const url = `/api/books/secure/renew?bookId=${bookId}`;
        const options = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        };
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("本の延長失敗");
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => {
        setCheckout(!checkout);
      }, 400);
    }
  }

  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>貸し出し: </h5>

            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {shelfCurrentLoan.book?.img ? (
                      <img
                        src={shelfCurrentLoan.book?.img}
                        width="226"
                        height="349"
                        alt="Book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="226"
                        height="349"
                        alt="Book"
                      />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>貸出情報</h4>
                        {shelfCurrentLoan.daysLeft > 0 && (
                          <p className="text-secondary">
                            返却日まで{shelfCurrentLoan.daysLeft}日
                          </p>
                        )}
                        {shelfCurrentLoan.daysLeft === 0 && (
                          <p className="text-success">返却日</p>
                        )}
                        {shelfCurrentLoan.daysLeft < 0 && (
                          <p className="text-danger">
                            {shelfCurrentLoan.daysLeft}日超過
                          </p>
                        )}
                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                          >
                            貸出管理
                          </button>
                          <Link
                            to={"search"}
                            className="list-group-item list-group-item-action"
                          >
                            本を探しますか?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">この本の感想をシェアしよう！</p>

                      {shelfCurrentLoan.isReviewLeft ? (
                        <Link
                          className="btn btn-primary"
                          to={`/checkout/${shelfCurrentLoan.book.id}`}
                        >
                          レビューする
                        </Link>
                      ) : (
                        <Link
                          className="btn btn-primary"
                          to={`/checkout/${shelfCurrentLoan.book.id}`}
                        >
                          レビュー管理
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  returnBook={returnBook}
                  mobile={false}
                  renewBook={renewBook}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">貸出はありません。</h3>
            <Link className="btn btn-primary" to={`/search`}>
              本を探す
            </Link>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className="mb-3">貸し出し: </h5>

            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {shelfCurrentLoan.book?.img ? (
                    <img
                      src={shelfCurrentLoan.book?.img}
                      width="226"
                      height="349"
                      alt="Book"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      width="226"
                      height="349"
                      alt="Book"
                    />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body container">
                    <div className="mt-3">
                      <h4>貸出管理</h4>
                      {shelfCurrentLoan.daysLeft > 0 && (
                        <p className="text-secondary">
                          {shelfCurrentLoan.daysLeft}日まで
                        </p>
                      )}
                      {shelfCurrentLoan.daysLeft === 0 && (
                        <p className="text-success">返却日</p>
                      )}
                      {shelfCurrentLoan.daysLeft < 0 && (
                        <p className="text-danger">
                          {shelfCurrentLoan.daysLeft}日超過
                        </p>
                      )}
                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                        >
                          書籍管理
                        </button>
                        <Link
                          to={"search"}
                          className="list-group-item list-group-item-action"
                        >
                          本を探しますか?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">この本の感想をシェアしよう！</p>

                    {shelfCurrentLoan.isReviewLeft ? (
                      <Link
                        className="btn btn-primary"
                        to={`/checkout/${shelfCurrentLoan.book.id}`}
                      >
                        レビューする
                      </Link>
                    ) : (
                      <Link
                        className="btn btn-primary"
                        to={`/checkout/${shelfCurrentLoan.book.id}`}
                      >
                        レビュー管理
                      </Link>
                    )}
                  </div>
                </div>

                <hr />
                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  returnBook={returnBook}
                  mobile={true}
                  renewBook={renewBook}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link className="btn btn-primary" to={`search`}>
              新しい本を探す
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
