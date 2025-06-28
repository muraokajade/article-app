import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Review } from "../components/Review";
import { Pagenation } from "../../SearchBooksPage/components/Pagenation";
import { useBookReviews } from "../../../hooks/useBookReviews";
import { useAuth } from "../../../hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";

export const ReviewListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const {
    displayPage: currentPage,
    setDisplayPage: setCurrentPage,
    pageIndex,
  } = usePagination();

  const [reviewsPerPage] = useState(5);
  const { bookId } = useParams<{ bookId: string }>();
  const numericbookId = Number(bookId);
  const { idToken, loading } = useAuth();

  const {
    reviews,
    fetchReviews,
    averageRating,
    totalAmountOfReviews,
    totalPages,
  } = useBookReviews(numericbookId, loading, idToken || "");

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        await fetchReviews();
      } catch (e: any) {
        setHttpError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookReviews();
  }, [currentPage, fetchReviews]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div>
        <p>{httpError}</p>
      </div>
    );
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div>
        <p>コメント: {reviews.length}</p>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
      </p>
      <div className="row">
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
      {totalPages > 0 && (
        <Pagenation
          maxPageLinks={5}
          displayPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
