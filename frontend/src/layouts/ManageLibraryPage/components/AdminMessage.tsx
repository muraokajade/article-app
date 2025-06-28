import { useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { useAuth } from "../../../hooks/useAuth";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

type AdminMessageProp = {
  message: MessageModel;
};

export const AdminMessage: React.FC<AdminMessageProp> = ({ message }) => {
  const { idToken, isAuthenticated, isAdmin, loading } = useAuth();

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");

  const submitResponseHandler = async () => {
    if (loading) return;
    if (!message.id || response.trim() === "") {
      setDisplayWarning(true);
      return;
    }

    try {
      const url = `/api/messages/secure/admin/message`;

      const messageRequest = {
        id: message.id,
        response: response,
      };
      const request = JSON.stringify(messageRequest);
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: request,
      };
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("データ送信失敗");

      //   alert("メッセージ送信！");
      setResponse("");
      setDisplaySuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
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
          <form action="PUT">
            {displayWarning && (
              <div className="alert alert-danger" role="alert">
                全てのフィールドを埋めてください
              </div>
            )}
            {displaySuccess && (
              <div className="alert alert-primary" role="alert">
                送信成功
              </div>
            )}
            <div className="col-md-12 mb-3">
              <label className="form-label"> Description </label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows={3}
                onChange={(e) => setResponse(e.target.value)}
                value={response}
              ></textarea>
            </div>
            <div>
              <button
                onClick={submitResponseHandler}
                type="button"
                className="btn btn-primary mt-3"
              >
                回答を送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
