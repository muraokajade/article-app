import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Pagenation } from "../../SearchBooksPage/components/Pagenation";
import { AdminMessage } from "./AdminMessage";

export const AdminMessages = () => {
  const { isAuthenticated, idToken, isAdmin } = useAuth();

  // Normal Loading Pieces
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Messages endpoint State
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  //ページネーション
  const { displayPage, pageIndex, setDisplayPage } = usePagination();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (isAuthenticated && idToken) {
        const url = `/api/messages/admin/questions?page=${pageIndex}&size=${messagesPerPage}`;
        const headers = {
          Authorization: `Bearer ${idToken}`,
        };
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("ユーザーメッセージの取得失敗");
        const data = await res.json();
        setMessages(data.content);
        setTotalPages(data.totalPages);
      }
      try {
      } catch (e: any) {
        console.error(e);
        setHttpError(e.message);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchUserMessages();
    window.scrollTo(0, 0);
  }, [isAuthenticated, displayPage, idToken, pageIndex, messagesPerPage]);

  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setDisplayPage(pageNumber);

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage message={message} key={message.id} />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
      )}
      {totalPages > 1 && (
        <Pagenation
          displayPage={displayPage}
          maxPageLinks={5}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
