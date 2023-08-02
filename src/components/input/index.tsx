import React, { useState, useEffect } from "react";
import { Input } from "antd";
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

export const InputComp: React.FC<PropInterface> = ({
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
  const [inputLength, setInputLength] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [inputVal, setInputVal] = useState<any>([]);
  const [questionAnswerRows, setQuestionAnswerRows] = useState<any>([]);
  const [remarkStatus, setRemarkStatus] = useState<boolean>(false);

  useEffect(() => {
    let replyContent = reply || "";
    let replyRows = replyContent;
    let arr = [];
    for (let i = 0; i < inputLength; i++) {
      if (typeof replyRows[i] !== "undefined") {
        arr.push(replyRows[i]);
      } else {
        arr.push(null);
      }
    }
    setInputVal(arr);
    if (wrongBook) {
      setRemarkStatus(true);
    } else {
      setRemarkStatus(false);
    }
  }, [reply, wrongBook, inputLength]);

  useEffect(() => {
    if (typeof question.input_length !== "undefined") {
      setInputLength(question.input_length);
    } else if (typeof question.answer !== "undefined" && question.answer) {
      let length = question.answer.split(",").length;
      setInputLength(length);
    } else {
      setInputLength(0);
    }

    if (typeof question === "undefined") {
      setQuestionAnswerRows([]);
    } else if (typeof question.answer_transform === "undefined") {
      setQuestionAnswerRows([]);
    } else if (question.answer_transform) {
      setQuestionAnswerRows(question.answer_transform);
    } else {
      setQuestionAnswerRows([]);
    }
  }, [question]);

  const change = (e: any) => {
    if (isOver) {
      return;
    }
    let val;
    if (e.target.value === "") {
      val = "";
    } else {
      val = inputVal;
    }
    update(question.id, val, null);
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
        {inputVal.map((item: any, index: number) => (
          <div
            key={index + "input" + question.question_id}
            className={styles["input-input-item"]}
          >
            <div className={styles["name"]}>
              填空{index + 1}（{questionAnswerRows[index].s}分）：
            </div>
            <div className={styles["input-box"]}>
              <Input
                className={styles["input"]}
                disabled={isOver}
                type="text"
                value={inputVal[index]}
                placeholder="请输入你的答案"
                onBlur={(e) => {
                  change(e);
                }}
                onChange={(e) => {
                  let arr = [...inputVal];
                  arr[index] = e.target.value;
                  setInputVal(arr);
                }}
              ></Input>
            </div>
            {isOver && (
              <div className={styles["icon-box"]}>
                {inputVal[index] === questionAnswerRows[index].a && (
                  <img src={rightIcon} className={styles["icon"]} />
                )}
                {inputVal[index] !== questionAnswerRows[index].a && (
                  <>
                    <img src={wrongIcon} className={styles["icon"]} />
                    <div className={styles["answer"]}>
                      答案：{questionAnswerRows[index].a}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {isOver &&
        ((wrongBook && question.remark && question.remark !== "") ||
          !wrongBook ||
          (remarkStatus && question.remark && question.remark !== "")) && (
          <div className="analysis-box">
            {wrongBook && question.remark && question.remark !== "" ? (
              <div className="answer-box">
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
              </div>
            ) : !wrongBook ? (
              <div className="answer-box">
                <div className="content">
                  <div className="score">
                    <i></i>得分：{score}
                  </div>
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
            ) : (
              <></>
            )}
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
