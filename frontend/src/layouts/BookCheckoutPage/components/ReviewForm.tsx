import { useState } from "react";
import { StarsReview } from "./StarsReview";
import { useSubmitReview } from "../../../hooks/useSubmitReview";
import { useAuth } from "../../../hooks/useAuth";
import BookModel from "../../../models/BookModel";

type Prop = {
  book: BookModel | undefined;
  fetchReviews: () => void;
  setIsReviewLeft: (v: boolean) => void;
};

export const ReviewForm: React.FC<Prop> = ({
  book,
  fetchReviews,
  setIsReviewLeft,
}) => {
  const { idToken } = useAuth();
  const [ratingInput, setRatingInput] = useState(0); // ← ここで無条件に Hooks を呼び出す
  const [reviewDescription, setReviewDescription] = useState("");
  const { submitReview } = useSubmitReview(book?.id || 0);

  if (!book) {
    return <div>本の情報がありません</div>;
  }
  const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div className="dropdown" style={{ cursor: "pointer" }}>
      <h5
        className="dropdown-toggle"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
      >
        レビューしますか？
      </h5>
      <ul
        id="submitReviewRating"
        className="dropdown-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        {ratings.map((r) => (
          <li key={r}>
            <button onClick={() => setRatingInput(r)} className="dropdown-item">
              {r} star
            </button>
          </li>
        ))}
      </ul>
      <StarsReview rating={ratingInput} size={32} />
      <form
        onSubmit={(e) => {
          console.log("レビュー送信");
          e.preventDefault();
          submitReview(ratingInput, reviewDescription).then(() => {
            fetchReviews();
            setIsReviewLeft(true);
          });
        }}
      >
        <hr />
        <div className="mb-3">
          <label>内容</label>
          <textarea
            className="form-control"
            rows={3}
            onChange={(e) => setReviewDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button className="btn btn-primary mt-3" type="submit">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};
