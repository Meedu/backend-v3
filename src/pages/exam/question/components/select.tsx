import React, { useState, useEffect } from "react";
import { QuestionQuillEditor, HelperText } from "../../../../components";
import { Select, Button, Input, message } from "antd";

interface PropInterface {
  onChange: (question: any, list: any) => void;
}

export const QSelect: React.FC<PropInterface> = ({ onChange }) => {
  const [answers, setAnswers] = useState<any>([]);
  const [length, setLength] = useState(4);
  const [selectedAnswers, setSelectedAnswers] = useState<any>([]);
  const [form, setForm] = useState<any>({
    score: null,
    content: null,
    answer: "",
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    option5: null,
    option6: null,
    option7: null,
    option8: null,
    option9: null,
    option10: null,
    remark: null,
  });

  useEffect(() => {
    let rows = [];
    for (let i = 0; i < length; i++) {
      rows.push({
        label: "选项" + (i + 1),
        value: "option" + (i + 1),
      });
    }
    setAnswers(rows);
  }, [length]);

  useEffect(() => {
    onChange(form, null);
  }, [form]);

  useEffect(() => {
    if (selectedAnswers.length > 0) {
      let obj = { ...form };
      obj.answer = selectedAnswers.join(",");
      setForm(obj);
    } else {
      let obj = { ...form };
      form.answer = "";
      setForm(obj);
    }
  }, [selectedAnswers]);

  const add = () => {
    if (length >= 10) {
      message.error("最多10个选项");
      return;
    }
    setLength(length + 1);
  };

  const del = () => {
    if (length <= 2) {
      message.error("至少得有两个选项");
      return;
    }
    setSelectedAnswers([]);
    let obj = { ...form };
    obj.answer = null;
    obj["option" + length] = null;
    setForm(obj);
    setLength(length - 1);
  };

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">分数</span>
        </div>
        <div className="float-left d-flex">
          <div>
            <Input
              type="number"
              value={form.score}
              onChange={(e) => {
                let obj = { ...form };
                obj.score = e.target.value;
                setForm(obj);
              }}
              allowClear
              style={{ width: 200 }}
              placeholder="分数"
            />
          </div>
          <div className="ml-10">
            <HelperText text="请输入整数。不支持小数。"></HelperText>
          </div>
          <div className="ml-10">
            <span className="helper-text">常见分数</span>
            <Button
              type="link"
              className="c-primary"
              onClick={() => {
                let obj = { ...form };
                obj.score = 1;
                setForm(obj);
              }}
            >
              1分
            </Button>
            <Button
              type="link"
              className="c-primary"
              onClick={() => {
                let obj = { ...form };
                obj.score = 2;
                setForm(obj);
              }}
            >
              2分
            </Button>
            <Button
              type="link"
              className="c-primary"
              onClick={() => {
                let obj = { ...form };
                obj.score = 5;
                setForm(obj);
              }}
            >
              5分
            </Button>
            <Button
              type="link"
              className="c-primary"
              onClick={() => {
                let obj = { ...form };
                obj.score = 10;
                setForm(obj);
              }}
            >
              10分
            </Button>
          </div>
        </div>
      </div>
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">试题内容</span>
        </div>
        <div className="float-left">
          <QuestionQuillEditor
            isFormula={true}
            height={40}
            defautValue=""
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
          <div className="float-left helper-label mb-10">
            <span className="c-red">*</span>
            <span className="ml-5">选项{i + 1}</span>
          </div>
          <div className="float-left">
            <QuestionQuillEditor
              isFormula={true}
              height={40}
              defautValue=""
              setContent={(value: string) => {
                let obj = { ...form };
                obj["option" + Number(i + 1)] = value;
                setForm(obj);
              }}
            ></QuestionQuillEditor>
          </div>
        </div>
      ))}
      <div className="float-left mb-15">
        <Button type="primary" onClick={() => add()}>
          新增选项
        </Button>
        <Button type="primary" className="ml-10" onClick={() => del()} danger>
          删除选项
        </Button>
      </div>
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">答案</span>
        </div>
        <div className="float-left">
          <Select
            style={{ width: 400 }}
            mode="multiple"
            value={selectedAnswers}
            onChange={(e) => {
              setSelectedAnswers(e);
            }}
            allowClear
            placeholder="答案"
            options={answers}
          />
        </div>
      </div>
      <div className="float-left">
        <div className="float-left helper-label mb-10">解析</div>
        <div className="float-left">
          <QuestionQuillEditor
            isFormula={true}
            height={40}
            defautValue=""
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
