import React, { useState, useEffect } from "react";
import { QuestionQuillEditor } from "../../../../components";
import { Button, Input, message } from "antd";

interface PropInterface {
  question: any;
  index: any;
  onChange: (question: any, list: any) => void;
}

export const QInput: React.FC<PropInterface> = ({
  question,
  index,
  onChange,
}) => {
  const [length, setLength] = useState(1);
  const [form, setForm] = useState<any>(
    question
      ? question
      : {
          score: null,
          content: null,
          answer: null,
          remark: null,
        }
  );
  const [answers, setAnswers] = useState<any>([
    {
      a: null,
      s: null,
    },
  ]);

  useEffect(() => {
    onChange(form, index);
  }, [form]);

  useEffect(() => {
    if (question) {
      // 解析答案
      if (
        question.answer &&
        question.answer.toString().substring(0, 5) === "v2:::"
      ) {
        let value = JSON.parse(question.answer.slice(5));
        setAnswers(value);
        setLength(value.length);
      }
    }
  }, [question]);

  const checkAnswers = (value: any, num: number) => {
    let data = [];
    let score = 0;
    for (let i = 0; i < num; i++) {
      data.push(value[i]);
      if (!value[i].s) {
        score = 0;
        break;
      } else if (parseInt(value[i].s) === 0) {
        score = 0;
        break;
      } else if (parseInt(value[i].s) > 0) {
        score += parseInt(value[i].s);
      }
    }
    let obj = { ...form };
    obj.answer = data;
    if (score > 0) {
      obj.score = score;
    } else {
      obj.score = null;
    }
    setForm(obj);
  };

  const inc = () => {
    setLength(length + 1);
    let arr = [...answers];
    arr.push({
      a: null,
      s: null,
    });
    setAnswers(arr);
    checkAnswers(arr, arr.length);
  };

  const dec = () => {
    if (length <= 1) {
      message.error("最少一个空");
      return;
    }
    let arr = [...answers];
    arr.splice(length - 1, 1);
    setAnswers(arr);
    setLength(length - 1);
    checkAnswers(arr, arr.length);
  };

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">试题内容</span>
        </div>
        <div className="float-left">
          <QuestionQuillEditor
            isFormula={true}
            height={40}
            defautValue={form.content}
            setContent={(value: string) => {
              let obj = { ...form };
              obj.content = value;
              setForm(obj);
            }}
          ></QuestionQuillEditor>
        </div>
      </div>
      {Array.from({ length: length }).map((_, i) => (
        <div className="float-left mb-15" key={i}>
          <div className="d-flex">
            <div className="helper-label">
              <span className="c-red">*</span>
              <span className="ml-5">空{i + 1}答案</span>
            </div>
            <div className="flex-1 ml-10">
              <Input
                value={answers[i].a}
                onChange={(e) => {
                  let arr = [...answers];
                  arr[i].a = e.target.value;
                  setAnswers(arr);
                  checkAnswers(arr, arr.length);
                }}
                allowClear
                style={{ width: 300 }}
                placeholder="答案"
              />
              <span style={{ fontSize: 14 }} className="c-red ml-10">
                *
              </span>
              <span className="helper-label ml-5">分数</span>
              <Input
                type="number"
                value={answers[i].s}
                onChange={(e) => {
                  let arr = [...answers];
                  arr[i].s = e.target.value;
                  setAnswers(arr);
                  checkAnswers(arr, arr.length);
                }}
                allowClear
                style={{ width: 200, marginLeft: 10 }}
                placeholder="分数"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="float-left mb-15">
        <Button type="primary" onClick={() => inc()}>
          增加一个空
        </Button>
        {length > 1 && (
          <Button type="primary" className="ml-10" onClick={() => dec()} danger>
            删除一个空
          </Button>
        )}
      </div>
      <div className="float-left">
        <div className="float-left helper-label mb-10">解析</div>
        <div className="float-left">
          <QuestionQuillEditor
            isFormula={true}
            height={40}
            defautValue={form.remark}
            setContent={(value: string) => {
              let obj = { ...form };
              obj.remark = value;
              setForm(obj);
            }}
          ></QuestionQuillEditor>
        </div>
      </div>
    </div>
  );
};
