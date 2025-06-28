import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";
import { ReviewForm } from "./ReviewForm";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  currentLoansCount: number;
  isAuthenticated: boolean;
  isCheckedout: boolean;
  isReviewLeft: boolean;
  checkoutBook: () => void;
  fetchReviews: () => void;
  setIsReviewLeft: (v: boolean) => void;
}> = ({
  book,
  currentLoansCount,
  isAuthenticated,
  isCheckedout,
  checkoutBook,
  isReviewLeft,
  fetchReviews,
  setIsReviewLeft,
}) => {
  function buttonRender() {
    if (!isAuthenticated) {
      return <Link to="/login">ログイン</Link>;
    }
    if (isCheckedout) {
      return <p>貸出中です。楽しんでください。</p>;
    }

    if (currentLoansCount > 10) {
      return <p>本は10冊以上借りられません。</p>;
    }

    return (
      <button className="btn btn-primary mt-2" onClick={checkoutBook}>
        チェックアウト
      </button>
    );
  }
function reviewRender() {
  if (!isAuthenticated) {
    return <p>ログインして本をチェックアウトできます！</p>;
  }

  if (!isCheckedout) {
    return <p>チェックアウトしてレビューも書いてくれたら嬉しいです。</p>;
  }

  if (isCheckedout && !isReviewLeft) {
    return (
      <div>
        <ReviewForm
          book={book}
          fetchReviews={fetchReviews}
          setIsReviewLeft={setIsReviewLeft}
        />
      </div>
    );
  }

  if (isReviewLeft) {
    return <p>レビューありがとうございます。</p>;
  }

  return null; // どれにも当てはまらない場合
}


  if (!book) return <div>本の情報が読み込めていません。</div>;

  return (
    <div className="card mt-3">
      <div className="card-body">
        {/* 貸出情報表示 */}
        <p className="mb-1">
          {`あなたは ${currentLoansCount}/5 冊 チェックアウト中`}
        </p>
        <p className="mb-1">
          <strong>在庫状況：</strong> {book?.copiesAvailable ?? 0} /{" "}
          {book?.copies ?? 0} 冊
        </p>
        <p>
          <strong>状態:</strong>{" "}
          {isCheckedout ? "チェックアウト済み" : "未チェックアウト"}
        </p>

        {/* ログインしているかどうかで分岐 */}
        {buttonRender()}

        {reviewRender()}
      </div>
    </div>
  );
};
