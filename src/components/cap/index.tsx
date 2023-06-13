import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { QuestionContentRender } from "../question-content-render";
import backIcon from "../../assets/img/icon-back-n.png";
import foldIcon from "../../assets/img/exam/fold.png";
import unfoldIcon from "../../assets/img/exam/unfold.png";
import {
  ChoiceComp,
  SelectComp,
  InputComp,
  JudgeComp,
  QaComp,
} from "../../components";

interface PropInterface {
  question: any;
  reply: any;
  isCorrect: number;
  isOver: boolean;
  score: number;
  showImage: boolean;
  wrongBook: boolean;
  num: number;
  update: (id: string, value: string, thumbs: any) => void;
}

export const CapComp: React.FC<PropInterface> = ({
  question,
  reply,
  isCorrect,
  isOver,
  score,
  showImage,
  wrongBook,
  num,
  update,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [questions, setQuestions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>([]);
  const [header, setHeader] = useState<any>(null);
  const [remarkStatus, setRemarkStatus] = useState<boolean>(false);

  useEffect(() => {
    if (reply) {
      let content = reply;
      setAnswers(content);
    }
    if (wrongBook) {
      setRemarkStatus(true);
    } else {
      setRemarkStatus(false);
    }
  }, [reply, wrongBook]);

  useEffect(() => {
    if (question) {
      let content = JSON.parse(question.content);

      // 题帽
      setHeader(content.header);

      // 题目
      let questions = [];
      for (let i = 0; i < content.questions.length; i++) {
        let tmp = content.questions[i];
        tmp.id = question.id + "-cap-" + i;
        tmp.level_text = "";
        questions.push(tmp);
      }

      setQuestions(questions);
    }
  }, [question]);

  const questionUpdate = (qid: string, answer: string, thumbs: any) => {
    update(qid, answer, thumbs);
  };

  const PreviewImage = (event: any) => {
    if (event.target.src) {
      event.stopPropagation();
      setThumb(event.target.src);
      setPreviewImage(true);
    }
  };

  const hasNotExists = (index: number) => {
    return typeof answers[index] === "undefined";
  };

  return (
    <div className={styles["spbackground"]}>
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
          text={question.content_transform.header_transform.text}
          images={question.content_transform.header_transform.images}
          iframes={question.content_transform.header_transform.iframes}
        ></QuestionContentRender>
      </div>
      <div className={styles["choice-box"]}>
        {questions.map((item: any, index: number) => (
          <div key={index + "cap"} className={styles["cap-item"]}>
            {hasNotExists(index) && (
              <>
                {/* 单选 */}
                {item.type === 1 && (
                  <ChoiceComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={null}
                    score={item.score}
                    isCorrect={0}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></ChoiceComp>
                )}
                {/* 多选 */}
                {item.type === 2 && (
                  <SelectComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={""}
                    score={item.score}
                    isCorrect={0}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></SelectComp>
                )}
                {/* 填空 */}
                {item.type === 3 && (
                  <InputComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={""}
                    score={item.score}
                    isCorrect={0}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></InputComp>
                )}
                {/* 问答 */}
                {item.type === 4 && (
                  <QaComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={null}
                    thumbs={[]}
                    score={item.score}
                    isCorrect={0}
                    isOver={isOver}
                    showImage={showImage}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></QaComp>
                )}
                {/* 判断 */}
                {item.type === 5 && (
                  <JudgeComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={null}
                    score={item.score}
                    isCorrect={0}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></JudgeComp>
                )}
              </>
            )}
            {!hasNotExists(index) && (
              <>
                {/* 单选 */}
                {item.type === 1 && (
                  <ChoiceComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={answers[index].answer}
                    score={answers[index].score}
                    isCorrect={answers[index].is_correct}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></ChoiceComp>
                )}
                {/* 多选 */}
                {item.type === 2 && (
                  <SelectComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={answers[index].answer_contents_row}
                    score={answers[index].score}
                    isCorrect={answers[index].is_correct}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></SelectComp>
                )}
                {/* 填空 */}
                {item.type === 3 && (
                  <InputComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={answers[index].answer_contents_rows}
                    score={answers[index].score}
                    isCorrect={answers[index].is_correct}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></InputComp>
                )}
                {/* 问答 */}
                {item.type === 4 && (
                  <QaComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={answers[index].answer}
                    thumbs={answers[index]["thumbs"]}
                    score={answers[index].score}
                    isCorrect={answers[index].is_correct}
                    isOver={isOver}
                    showImage={showImage}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></QaComp>
                )}
                {/* 判断 */}
                {item.type === 5 && (
                  <JudgeComp
                    key={item.question_id}
                    num={index + 1}
                    question={item}
                    reply={answers[index].answer_contents_rows}
                    score={answers[index].score}
                    isCorrect={answers[index].is_correct}
                    isOver={isOver}
                    wrongBook={wrongBook}
                    update={(id: string, value: string, thumbs: any) => {
                      questionUpdate(id, value, thumbs);
                    }}
                  ></JudgeComp>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {isOver && (
        <div className="analysis-box">
          <div className="answer-box">
            <div className="content">
              {question.answer && question.answer !== "" && (
                <div className="answer">
                  <i></i>答案：{question.answer}
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
