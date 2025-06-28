import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { useAuth } from "../../../hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Pagenation } from "../../SearchBooksPage/components/Pagenation";

export const Messages = () => {
  const { isAuthenticated, idToken } = useAuth();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const { displayPage, setDisplayPage, pageIndex } = usePagination();

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // Pagination
  const [messagesPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchUserMessages = async () => {
      try {
        if (isAuthenticated && idToken) {
          const url = `/api/messages/secure/questions?page=${pageIndex}&size=${messagesPerPage}`;
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          };
          const res = await fetch(url, requestOptions);
          if (!res.ok) {
            throw new Error("メッセージ取得に失敗しました");
          }
          const data = await res.json();
          console.log(data);
          setMessages(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error: any) {
        setHttpError(error.message || "不明なエラーが発生しました");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchUserMessages();
    window.scrollTo(0, 0);
  }, [isAuthenticated, idToken, displayPage]);

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
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case #{message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from administration. Please be patient.
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here</h5>
      )}
      {totalPages > 1 && (
        <Pagenation
          displayPage={displayPage}
          totalPages={totalPages}
          maxPageLinks={5}
          paginate={paginate}
        />
      )}
    </div>
  );
};
