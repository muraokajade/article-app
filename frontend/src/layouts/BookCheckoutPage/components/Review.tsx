import ReviewModel from "../../../models/ReviewModel";
import { StarsReview } from "./StarsReview";

export const Review: React.FC<{ review: ReviewModel }> = ({ review }) => {
  const date = new Date(review.date);
  const longMonth = date.toLocaleDateString("en-us", { month: "long" });
  const dateDay = date.getDate();
  const dateYear = date.getFullYear();

  const dateRender = longMonth + " " + dateDay + ", " + dateYear;

  return (
    <div>
      <div className="col-sm-8 col-md-8">
        <h5>{review.userEmail}</h5>
        <div className="row">
          <div className="col">{dateRender}</div>
          <div className="col">
            <StarsReview rating={review.rating} size={16} />
          </div>
        </div>
        <div className="mt-2">
          <p
            className="lead text-wrap text-break"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {review.reviewDescription}
          </p>
        </div>
      </div>
      <hr />
    </div>
  );
};
