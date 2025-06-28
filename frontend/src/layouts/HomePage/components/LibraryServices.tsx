import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export const LibraryServices = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="container my-5">
      <div className="row p-4 align-items-center border shadow-lg">
        <div className="col-lg-7 p-3">
          <h1 className="display-4 fw-bold">
            Can't find what you are looking for?
          </h1>
          <p className="lead">
            何かわからないことがあれば質問を送ってください!
          </p>
          <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
            {isAuthenticated ? (
              <Link className="btn main-color btn-lg text-white" to="/messages">
                質問を送る
              </Link>
            ) : (
              <Link className="btn main-color btn-lg text-white" to="/login">
                ログイン
              </Link>
            )}
          </div>
        </div>
        <div className="col-lg-4 offset-lg-1 shadow-lg lost-image"></div>
      </div>
    </div>
  );
};
