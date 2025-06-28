import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {
  const { isAuthenticated,isAdmin,loading } = useAuth();

  const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] =
    useState(false);
  const [messagesClick, setMessagesClick] = useState(false);

  function addBookClick() {
    setChangeQuantityOfBooksClick(false);
    setMessagesClick(false);
  }

  function changeQuantityOfBooksClickFunction() {
    setChangeQuantityOfBooksClick(true);
    setMessagesClick(false);
  }

  function messagesClickFunction() {
    setChangeQuantityOfBooksClick(false);
    setMessagesClick(true);
  }

  if(loading) {
    return <div>Loading...</div>
  }

  if(!isAdmin) {//ここで切り替え
    return <Navigate to="/home" replace/>
  }

  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Library</h3>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-add-book-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-book"
              type="button"
              role="tab"
              aria-controls="nav-add-book"
              aria-selected="false"
              onClick={addBookClick}
            >
              Add new book
            </button>
            
            <button
              className="nav-link"
              id="nav-quantity-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-quantity"
              type="button"
              role="tab"
              aria-controls="nav-quantity"
              aria-selected="true"
              onClick={changeQuantityOfBooksClickFunction}
            >
              Change quantity
            </button>
            <button
              className="nav-link"
              id="nav-messages-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-messages"
              type="button"
              role="tab"
              aria-controls="nav-messages"
              aria-selected="false"
              onClick={messagesClickFunction}
            >
              Messages
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-book-tab"
          >
            <AddNewBook />
          </div>
          <div
            className="tab-pane fade"
            id="nav-quantity"
            role="tabpanel"
            aria-labelledby="nav-quantity-tab"
          >
            {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks/> : <>ああああああああ</>}
          </div>
          <div
            className="tab-pane fade"
            id="nav-messages"
            role="tabpanel"
            aria-labelledby="nav-messages-tab"
          >
            {messagesClick ? <AdminMessages/> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};
