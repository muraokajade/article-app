import { useState, useEffect, useCallback } from "react";
import ReviewModel from "../models/ReviewModel";

export const useBookReviews = (
  bookId: number,
  loading: boolean,
  idToken: string
) => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const numericBookId = Number(bookId);

  // ✅ fetchReviews を useCallback で定義
  const fetchReviews = useCallback(async () => {
    if (loading) return;

    const url = `/api/reviews?bookId=${numericBookId}&page=0&size=5`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) throw new Error("レビュー取得失敗");

    const data = await res.json();
    const reviews: ReviewModel[] = data.reviews.map(
      (item: any) =>
        new ReviewModel(
          item.id,
          item.usrEmail,
          item.date,
          item.rating,
          item.bookId,
          item.reviewDescription
        )
    );

    setReviews(reviews);
    setTotalAmountOfReviews(data.totalElements);
    setTotalPages(data.totalPages);

    const total = reviews.reduce((accu, curr) => accu + curr.rating, 0);
    const average = reviews.length ? total / reviews.length : 0;
    setAverageRating(average);
  }, [numericBookId, idToken, loading]); // ✅ 依存配列に必要な変数を追加

  // ✅ 依存配列に fetchReviews を含めても、useCallback で安定
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, averageRating, fetchReviews,totalAmountOfReviews, totalPages };
};
