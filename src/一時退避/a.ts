import { useState, useEffect } from "react";
import axios from "axios";

type Score = {
  id: number;
  userId: number;
  score: number;
};

export const useReviewScores = (articleId: number, myUserId: number) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 全スコア取得
  const fetchScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/review-scores?articleId=${articleId}`, {
        withCredentials: true,
      });
      setScores(res.data ?? []);
    } catch (e) {
      setError("スコア取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [articleId]);

  // 自分のスコア
  const myScoreObj = scores.find(s => s.userId === myUserId) ?? null;
  const myScore = myScoreObj?.score ?? null;
  const myScoreId = myScoreObj?.id ?? null;

  // 投稿・更新
  const submitScore = async (score: number) => {
    setLoading(true);
    setError(null);
    try {
      if (myScoreId == null) {
        await axios.post(
          "/api/review-scores",
          { articleId, score },
          { withCredentials: true }
        );
      } else {
        await axios.put(
          `/api/review-scores/${myScoreId}`,
          { score },
          { withCredentials: true }
        );
      }
      await fetchScores();
    } catch (e) {
      setError("スコア送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 平均値
  const average =
    scores.length > 0
      ? Math.round((scores.reduce((sum, cur) => sum + cur.score, 0) / scores.length) * 100) / 100
      : null;

  return { scores, myScore, loading, submitScore, average, error };
};
