import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { usePagination } from "../../../hooks/usePagination";
import { Link, useParams } from "react-router-dom";
import { Pagenation } from "../../SearchBooksPage/components/Pagenation";

export const HistoryPage = () => {
  const { isAuthenticated, idToken } = useAuth();

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  // Pagination
  const { displayPage, setDisplayPage, totalPages, setTotalPages, pageIndex } =
    usePagination();

  useEffect(() => {
    const fetchUserHistorys = async () => {
      if (isAuthenticated && idToken) {
        try {
          const url = `/api/histories/secure/user/history?page=${pageIndex}&size=5`;

          const headers = {
            Authorization: `Bearer ${idToken}`,
          };

          const res = await fetch(url, { headers });
          if (!res.ok) throw new Error("履歴取得に失敗しました。");
          const data = await res.json();
          setHistories(data.content);
          setTotalPages(data.totalPages);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        setIsLoadingHistory(false);
      }
    };
    fetchUserHistorys();
  }, [isAuthenticated, idToken, displayPage, pageIndex, setTotalPages]);

  if (isLoadingHistory) {
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
      {histories.length > 0 ? (
        <>
          <h5>Recent History:</h5>

          {histories.map((history) => (
            <div key={history.id}>
              <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      {history.img ? (
                        <img
                          src={history.img}
                          width="123"
                          height="196"
                          alt="Book"
                        />
                      ) : (
                        <img
                          src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                          width="123"
                          height="196"
                          alt="Default"
                        />
                      )}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                      {history.img ? (
                        <img
                          src={history.img}
                          width="123"
                          height="196"
                          alt="Book"
                        />
                      ) : (
                        <img
                          src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                          width="123"
                          height="196"
                          alt="Default"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title"> {history.author} </h5>
                      <h4>{history.title}</h4>
                      <p className="card-text">{history.description}</p>
                      <hr />
                      <p className="card-text">
                        {" "}
                        Checked out on: {history.checkoutDate}
                      </p>
                      <p className="card-text">
                        {" "}
                        Returned on: {history.returnedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="mt-3">Currently no history: </h3>
          <Link className="btn btn-primary" to={"search"}>
            Search for new book
          </Link>
        </>
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
