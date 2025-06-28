import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { isAuthenticated, loading, idToken } = useAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    if (loading) return;
    const url = `/api/messages/secure/add/message`;
    if (isAuthenticated && title !== "" && question !== "") {
      const messageRequestModel: MessageModel = new MessageModel(
        title,
        question
      );

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("メッセージ送信失敗");
    //   const data = await res.json();

      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className="card mt-3">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Question added successfully
        </div>
      )}
      <div className="card-header">Ask question to Luv 2 Read Admin</div>
      <div className="card-body">
        <form method="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
