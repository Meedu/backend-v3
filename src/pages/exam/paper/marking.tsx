import { useState, useEffect } from "react";
import { Modal, Table, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, PerButton, QuestionRender } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { paper } from "../../../api/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  user_id: number;
}

const PaperMarkingPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [userPaper, setUserPaper] = useState<any>({});
  const [questions, setQuestions] = useState<any>([]);
  const [score, setScore] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [optionLength, setOptionLength] = useState(10);
  const [id, setId] = useState(Number(result.get("id")));
  const [pid, setPid] = useState(Number(result.get("user_paper_id")));

  useEffect(() => {
    document.title = "阅卷";
    dispatch(titleAction("阅卷"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setPid(Number(result.get("user_paper_id")));
  }, [result.get("id"), result.get("user_paper_id")]);

  useEffect(() => {
    if (questions.length === 0) {
      setList([]);
      return;
    }
    let arr = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      if (question.question === null) {
        continue;
      }
      if (question.question.type === 4) {
        // 问答题
        arr.push({
          id: question.id,
          score: question.question.score,
          header: null,
          content: question.question.content,
          remark: question.question.remark,
          answer: question.answer_content,
          thumbs: question.thumbs ? JSON.parse(question.thumbs) : [],
        });
        continue;
      }
      if (question.question.type === 6) {
        // 题帽题
        let questionContent = JSON.parse(question.question.content);
        let answerContent = question.answer_contents_rows;
        for (let j = 0; j < questionContent.questions.length; j++) {
          let childrenQuestion = questionContent.questions[j];
          let childrenAnswer =
            typeof answerContent[j] === "undefined" ? null : answerContent[j];
          if (childrenQuestion.type === 4) {
            // 题帽题中含有问答题
            arr.push({
              id: question.id + "-cap-" + j,
              score: childrenQuestion.score,
              header: questionContent.header,
              content: childrenQuestion.content,
              remark: question.question.remark,
              answer: childrenAnswer ? childrenAnswer["answer"] : "",
              thumbs:
                childrenAnswer && childrenAnswer["thumbs"] !== ""
                  ? JSON.parse(childrenAnswer["thumbs"])
                  : [],
            });
          }
        }

        continue;
      }
    }
    setList(arr);
  }, [questions]);

  const formValidate = () => {
    confirm();
  };

  const confirm = () => {
    if (loading) {
      return;
    }
    if (score.length === 0) {
      message.error("请打分后再提交");
      return;
    }
    setLoading(true);
    var data: any = {};
    for (let i = 0; i < list.length; i++) {
      var item = list[i];
      data[item.id] = {
        score: score[item.id],
      };
    }
    paper
      .submitScore({
        id: id,
        user_paper_id: pid,
        data: data,
      })
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        navigate(-1);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="阅卷"></BackBartment>
      <div className="float-left mt-30">
        <div className="bottom-menus">
          <div className="bottom-menus-box">
            <div>
              {userPaper.status === 3 && (
                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => formValidate()}
                >
                  保存
                </Button>
              )}
            </div>
            <div className="ml-24">
              <Button type="default" onClick={() => navigate(-1)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperMarkingPage;
