import React, { useEffect, useState } from "react";
import styles from "./ProjectDelivery.module.css";
import { Link } from "react-router-dom";
import URL from "../../../config/api";
import axios from "axios";
import { url2 } from "../../../config/url";

const progressColor = {
  Installed: {
    progressWidth: "100%",
    progressColor: "Green",
    statusColor: "LinearGreen",
  },
  Delivered: {
    progressColor: "#FEAD37",
    statusColor: "FEAD37",
    progressWidth: "50%",
  },
  Pending: {
    statusColor: "#FF5E00",
    progressColor: "#FF5E00",
    progressWidth: "25%",
  },
  In_Transit: {
    progressColor: "#6C35B1",
    statusColor: "LinearGreen",
    progressWidth: "60%",
  },
};

function ProjectDelivery({ selectedProject }) {
  const [data, setData] = useState([]);
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});
  // const location = useLocation();

  const fetchManufacturers = async () => {
    const projectId = JSON.parse(localStorage.getItem("selectedProjectId"));

    try {
      const res = await axios.get(`${URL}/items/${projectId}`);
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log("Error fetching items:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const latestComments = {};

      // Loop through each item to fetch comments
      await Promise.all(
        data.map(async (item) => {
          const res = await axios.get(`${URL}/items/${item.id}/comments`);
          const itemComments = res?.data;

          if (itemComments && itemComments.length > 0) {
            const userComments = itemComments.filter(
              (cmt) => cmt.createdByType === "user"
            );

            if (userComments.length > 0) {
              userComments.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              latestComments[item.id] = userComments[0];
            }
          }
        })
      );

      setLatestCommentsByItem(latestComments);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  // Fetch items when selectedProject changes
  useEffect(() => {
    fetchManufacturers();
  }, [selectedProject]);

  // Fetch comments once items are available
  useEffect(() => {
    if (data && data.length > 0) {
      fetchComments();
    }
  }, [data]);
  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date; // difference in milliseconds
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    // If the time difference is less than 7 days, show relative time
    if (days < 7) {
      if (minutes < 1) {
        return "just now";
      } else if (minutes < 60) {
        return minutes === 1 ? "1 min ago" : `${minutes} min ago`;
      } else if (hours < 24) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      } else {
        return days === 1 ? "1 day ago" : `${days} days ago`;
      }
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  return (
    <div>
      <div className={styles.DeliveryUpdate}>
        <h4>Project Delivery Update</h4>
        <button className={styles.button}>View All</button>
      </div>
      <div className={styles.dlDate}>
        <p>2025-04-11</p>
      </div>

      <div className={styles.Container}>
        {data
          ?.filter((item) => item.itemName && item.itemName.trim() !== "") //
          .map((item) => {
            const latestComment = latestCommentsByItem[item.id];

            return (
              <Link
                to="/orderinfo"
                key={item.id}
                state={{ item }}
                className={styles.linkStyle}
              >
                <div className={styles.orderCard}>
                  {/* Header */}
                  <div className={styles.orderHeader}>
                    <h2 className={styles.orderTitle}>{item.itemName}</h2>
                    <span
                      className={styles.orderStatus}
                      style={{
                        color:
                          progressColor[item.status]?.progressColor ||
                          progressColor["In_Transit"].progressColor,
                      }}
                    >
                      {item.status}
                      <span
                        className={styles.LineColor}
                        style={{
                          backgroundColor:
                            progressColor[item.status]?.progressColor ||
                            progressColor["In_Transit"].progressColor,
                        }}
                      ></span>
                    </span>
                  </div>

                  {/* ETD & ETA */}
                  {item.expectedDeliveryDate ? (
                    <>
                      <p className={styles.orderDetails}>
                        <strong>ETD :</strong>{" "}
                        {item.expectedDeliveryDate?.slice(0, 10)} |{" "}
                        <strong>ETA :</strong>{" "}
                        {item.expectedArrivalDate?.slice(0, 10)}
                      </p>
                    </>
                  ) : (
                    "TBD"
                  )}

                  {/* Comment Box */}
                  {latestComment && (
                    <div className={styles.commentBox}>
                      <div className={styles.commentHeader}>
                        <p className={styles.commentUser}>
                          <img
                            src={`${url2}/${latestComment.profilePhoto}`}
                            alt="Profile"
                            className={styles.PicImg}
                          />
                          {latestComment.createdByName}
                        </p>
                        <p className={styles.commentTime}>
                          {formatTime(latestComment.createdAt)}
                        </p>
                      </div>
                      <p className={styles.commentMessage}>
                        {latestComment.comment}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className={styles.orderFooter}>
                    <span className={styles.TimeFlex}>
                      {/* <img src="/Svg/TimeIcon.svg" alt="Time" />
                      {formatTime(item?.createdAt)} */}
                    </span>
                    <button className={styles.addComment}>
                      <img src="/Svg/CommentIcon.svg" alt="Comment" />
                      Add Comment
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progress}
                      style={{
                        width:
                          progressColor[item.status]?.progressWidth ||
                          progressColor["In_Transit"].progressWidth,
                        backgroundColor:
                          progressColor[item.status]?.progressColor ||
                          progressColor["In_Transit"].progressColor,
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default ProjectDelivery;
