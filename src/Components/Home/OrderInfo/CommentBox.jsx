import React, { useEffect, useState } from "react";
import styles from "./OrderInfo.module.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import URL from "../../../config/api";
import { url2 } from "../../../config/url";

function CommentBox() {
  const location = useLocation();
  const { item } = location.state || {};
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const customerId = customerInfo?.id;

  const projectId = JSON.parse(localStorage.getItem("selectedProjectId"));

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${URL}/items/${item.id}/comments`);
      setComments(res.data.reverse()); // newest comment at bottom
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`${URL}/items/${item.id}/comments`, {
        projectId,
        comment: newComment,
        createdById: customerId,
        createdByType: "customer"
      });

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  useEffect(() => {
    if (item?.id) fetchComments();
  }, [item]);

  return (
    <div className={styles.container}>
      <h4 className={styles.commentHistory}>Comments History</h4>

      <div className={styles.commentbox}>
        <div className={styles.CommentInner}>
          {comments.map((cmt, idx) =>
            cmt.createdById === customerId ? (
              <div key={idx} className={styles.Usercomment}>
                <div className={styles.UsercommentMain}>
                  <div className={styles.UsercommentText}>
                    <p className={styles.Userpara}>{cmt.comment}</p>
                  </div>
                  <p className={styles.UserBTime}>{formatTime(cmt.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div key={idx} className={styles.BHousecomment}>
                <img
                  src={
                    cmt.profilePhoto
                      ? `${url2}/${cmt.profilePhoto}`
                      : "/Svg/ChatBHouse.svg"
                  }
                  alt="chat"
                />
                <div className={styles.BHousecommentMain}>
                  <div className={styles.BHousecommentText}>
                    <p className={styles.para}>{cmt.comment}</p>
                  </div>

                  <div className={styles.BTime}>
                    <span>
                      {cmt.createdByName}
                      {cmt.userRole && (
                        <span className={styles.userRole}>
                          {" "}({cmt.userRole})
                        </span>
                      )}
                    </span>
                    <span style={{ marginLeft: "10px" }}>{formatTime(cmt.createdAt)}</span>
                  </div>
                </div>
              </div>

            )
          )}
        </div>
      </div>

      {/* Comment input */}
      <div>
        <textarea
          className={styles.Commenrtextarea}
          placeholder="Comment or (Leave your thought here)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        <button className={styles.CommenrButton} onClick={handleSubmit}>
          Comment Submit
        </button>
      </div>
    </div>
  );
}

export default CommentBox;
