import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Button } from "antd";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { paper as examPaper } from "../../../api/index";
import {
  ChoiceComp,
  SelectComp,
  InputComp,
  JudgeComp,
  QaComp,
  CapComp,
  BackBartment,
} from "../../../components";
import htmlToPdf from "../../../js/htmlToPdf";

const PaperReadPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [paper, setPaper] = useState<any>({});
  const [userPaper, setUserPaper] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [questions, setQuestions] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));
  const [pid, setPid] = useState(Number(result.get("pid")));

  useEffect(() => {
    document.title = "查看考试";
    dispatch(titleAction("查看考试"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setPid(Number(result.get("pid")));
  }, [result.get("id"), result.get("pid")]);

  useEffect(() => {
    getData();
  }, [id, pid]);

  const getData = () => {
    examPaper.paperJoinRecord(id, pid).then((res: any) => {
      setPaper(res.data.paper);
      setUserPaper(res.data.user_paper);
      setUser(res.data.user);
      let normaldata = res.data.questions;
      if (normaldata.length === 0) {
        message.error("未获取到试题");
        navigate(-1);
        return;
      }
      let box = [];
      for (let key in normaldata) {
        box.push(...normaldata[key]);
      }
      setQuestions(box);
    });
  };

  const download = () => {
    let shareContent: any = document.querySelector("#pdfDom");
    let imgList = shareContent.querySelectorAll("img");
    if (imgList) {
      var i;
      for (i = 1; i < imgList.length; i++) {
        imgList[i].src += "&timeSign=" + Date.now().toString();

        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgList[i].src, true);
        xhr.send();
      }
    }
    htmlToPdf.getPdf(paper.title);
  };

  const questionUpdate = (qid: string, value: string, thumbs: any) => {
    console.log(qid + ":" + thumbs + ":" + value);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="查看考试" />
      <Button
        className="mt-30"
        type="primary"
        onClick={() => {
          download();
        }}
      >
        下载pdf格式试卷
      </Button>
      <div className="float-left" id="pdfDom">
        <div className="read-paper-box">
          <div className="top float-left d-flex">
            <div className="user-info">考生：{user.nick_name}</div>
            <div className="user-info">考卷：{paper.title}</div>
            <div className="score-info">
              及格分/总分：{paper.pass_score}/{paper.score}
            </div>
            {userPaper && userPaper.status === 2 ? (
              <div className="score">
                考试得分：<strong>{userPaper.score}分</strong>
              </div>
            ) : (
              <div className="score">阅卷中</div>
            )}
          </div>
          <div className="line float-left d-flex"></div>
          {questions && userPaper && (
            <div className="questions-box">
              {questions.length > 0 &&
                questions.map((item: any, index: number) => (
                  <div className="item" key={index}>
                    {item.question.type === 1 && (
                      <ChoiceComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_content}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></ChoiceComp>
                    )}
                    {item.question.type === 2 && (
                      <SelectComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_contents_rows}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></SelectComp>
                    )}
                    {item.question.type === 3 && (
                      <InputComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_contents_rows}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></InputComp>
                    )}
                    {item.question.type === 4 && (
                      <QaComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_content}
                        thumbs={item.thumbs_rows}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        showImage={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></QaComp>
                    )}
                    {item.question.type === 5 && (
                      <JudgeComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_contents_rows}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></JudgeComp>
                    )}
                    {item.question.type === 6 && (
                      <CapComp
                        key={item.question_id}
                        num={index + 1}
                        question={item.question}
                        reply={item.answer_contents_rows}
                        score={item.score}
                        isCorrect={item.is_correct}
                        isOver={true}
                        showImage={true}
                        wrongBook={false}
                        update={(id: string, value: string, thumbs: any) => {
                          questionUpdate(id, value, thumbs);
                        }}
                      ></CapComp>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperReadPage;
