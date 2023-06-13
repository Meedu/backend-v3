import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { QuestionContentRender } from "../question-content-render";
import backIcon from "../../assets/img/icon-back-n.png";
import rightIcon from "../../assets/img/exam/icon-right.png";
import wrongIcon from "../../assets/img/exam/icon-Wrong.png";
import foldIcon from "../../assets/img/exam/fold.png";
import unfoldIcon from "../../assets/img/exam/unfold.png";

interface PropInterface {
  question: any;
  reply: any;
  isCorrect: number;
  isOver: boolean;
  score: number;
  wrongBook: boolean;
  num: number;
  update: (id: string, value: string, thumbs: any) => void;
}

export const JudgeComp: React.FC<PropInterface> = ({
  question,
  reply,
  isCorrect,
  isOver,
  score,
  wrongBook,
  num,
  update,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [remarkStatus, setRemarkStatus] = useState<boolean>(false);

  useEffect(() => {
    setActive(reply);
    if (wrongBook) {
      setRemarkStatus(true);
    } else {
      setRemarkStatus(false);
    }
  }, [reply, wrongBook]);

  const change = (index: any) => {
    if (isOver) {
      return;
    }
    let value = index;
    setActive(value);
    update(question.id, value, null);
  };

  const PreviewImage = (event: any) => {
    if (event.target.src) {
      event.stopPropagation();
      setThumb(event.target.src);
      setPreviewImage(true);
    }
  };

  return (
    <div className={styles["choice-item"]}>
      {previewImage && (
        <div className={styles["preview-image"]}>
          <img
            src={backIcon}
            className={styles["back-detail"]}
            onClick={() => setPreviewImage(false)}
          />
          <div className={styles["pic-item"]}>
            <div
              className={styles["pic"]}
              style={{ backgroundImage: "url(" + thumb + ")" }}
            ></div>
          </div>
        </div>
      )}
      <div className={styles["info"]}>
        <span className={styles["tit"]}>
          {num}.{question.type_text}（{question.score}分）
        </span>
      </div>
      <div className={styles["question-content"]}>
        <QuestionContentRender
          text={question.content_transform.text}
          images={question.content_transform.images}
          iframes={question.content_transform.iframes}
        ></QuestionContentRender>
      </div>
      <div className={styles["choice-box"]}>
        {isOver && (
          <>
            <div
              className={
                active === 1
                  ? styles["judge-active-item"]
                  : styles["judge-item"]
              }
              onClick={() => change(1)}
            >
              {parseInt(question.answer) === 1 ? (
                <div className={styles["answer-index"]}>
                  <img src={rightIcon} className={styles["icon"]} />
                </div>
              ) : active === 1 ? (
                <div className={styles["answer-index"]}>
                  <img src={wrongIcon} className={styles["icon"]} />
                </div>
              ) : (
                <div className={styles["index"]}></div>
              )}
              正确
            </div>
            <div
              className={
                active === 0
                  ? styles["judge-active-item"]
                  : styles["judge-item"]
              }
              onClick={() => change(0)}
            >
              {parseInt(question.answer) === 0 ? (
                <div className={styles["answer-index"]}>
                  <img src={rightIcon} className={styles["icon"]} />
                </div>
              ) : active === 0 ? (
                <div className={styles["answer-index"]}>
                  <img src={wrongIcon} className={styles["icon"]} />
                </div>
              ) : (
                <div className={styles["index"]}></div>
              )}
              错误
            </div>
          </>
        )}
        {!isOver && (
          <>
            <div
              className={
                active === 1
                  ? styles["judge-active-item"]
                  : styles["judge-item"]
              }
              onClick={() => change(1)}
            >
              <div className={styles["index"]}>
                <strong></strong>
              </div>
              正确
            </div>
            <div
              className={
                active === 0
                  ? styles["judge-active-item"]
                  : styles["judge-item"]
              }
              onClick={() => change(0)}
            >
              <div className={styles["index"]}>
                <strong></strong>
              </div>
              错误
            </div>
          </>
        )}
      </div>
      {isOver && (
        <div className="analysis-box">
          <div className="answer-box">
            <div className="content">
              <div className="answer">
                <i></i>答案：{parseInt(question.answer) === 1 ? "正确" : "错误"}
              </div>
              {!wrongBook && isCorrect !== 1 && (
                <div className="my-answer">
                  <i></i>我的答案：
                  {parseInt(active) !== -1 && (
                    <span>{parseInt(active) === 1 ? "正确" : "错误"}</span>
                  )}
                  {parseInt(active) === -1 && <span>--</span>}
                </div>
              )}
              {!wrongBook && (
                <div className="score">
                  <i></i>得分：{score}
                </div>
              )}
            </div>
            {question.remark && question.remark !== "" && (
              <div
                className="button"
                onClick={() => setRemarkStatus(!remarkStatus)}
              >
                {remarkStatus && (
                  <>
                    <span>折叠解析</span>
                    <img src={foldIcon} className="icon" />
                  </>
                )}
                {!remarkStatus && (
                  <>
                    <span>展开解析</span>
                    <img src={unfoldIcon} className="icon" />
                  </>
                )}
              </div>
            )}
          </div>
          {remarkStatus && question.remark && question.remark !== "" && (
            <div className="remark-box">
              <div className="left-remark">
                <div className="tit">
                  <i></i>解析：
                </div>
              </div>
              <div className="remark">
                <QuestionContentRender
                  text={question.remark_transform.text}
                  images={question.remark_transform.images}
                  iframes={question.remark_transform.iframes}
                ></QuestionContentRender>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
