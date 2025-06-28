import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoansModal: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoans;
  mobile: boolean;
  returnBook: any;
  renewBook: any;
}> = ({ shelfCurrentLoan, mobile, returnBook, renewBook }) => {
  return (
    <div
      className="modal fade"
      id={
        mobile
          ? `mobilemodal${shelfCurrentLoan.book.id}`
          : `modal${shelfCurrentLoan.book.id}`
      }
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              書籍管理
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {shelfCurrentLoan.book?.img ? (
                      <img
                        src={shelfCurrentLoan.book?.img}
                        width="56"
                        height="87"
                        alt="Book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="56"
                        height="87"
                        alt="Book"
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{shelfCurrentLoan.book.author}</h6>
                    <h4>{shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {shelfCurrentLoan.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                {shelfCurrentLoan.daysLeft === 0 && (
                  <p className="text-success">Due Today.</p>
                )}
                {shelfCurrentLoan.daysLeft < 0 && (
                  <p className="text-danger">
                    Past due by {shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                <div className="list-group mt-3">
                  <button
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                    onClick={() => returnBook(shelfCurrentLoan.book.id)}
                  >
                    返却
                  </button>
                  <button
                    data-bs-dismiss="modal"
                    onClick={() => renewBook(shelfCurrentLoan.book.id)}
                    className={
                      shelfCurrentLoan.daysLeft < 0
                        ? "list-group-item list-group-item-action inactiveLink"
                        : "list-group-item list-group-item-action"
                    }
                  >
                    {shelfCurrentLoan.daysLeft < 0
                      ? "返却期限を過ぎた貸出は延長できません"
                      : "貸出期限を7日間延長する"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
