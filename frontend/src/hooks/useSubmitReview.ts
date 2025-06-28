import { getAuth } from "firebase/auth";
import ReviewRequestModel from "../models/ReviewRequestModel";

export const useSubmitReview = (bookId: number) => {
  const submitReview = async (rating: number, reviewDescription: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const idToken = await currentUser.getIdToken(true);

    const url = `/api/reviews/secure`;

    const requestBody = new ReviewRequestModel(
      bookId,
      rating,
      reviewDescription
    );
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    const res = await fetch(url, requestOptions);
    if (!res.ok) throw new Error("レビュー投稿失敗");
    console.log("レビュー送信成功");
  };
  return { submitReview };
};
