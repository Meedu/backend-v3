import React, { useState, useEffect } from "react";
import { QuestionQuillEditor, HelperText } from "../../../../components";
import { Radio, Button, Input, message } from "antd";
import type { RadioChangeEvent } from "antd";

interface PropInterface {
  question: any;
  index: any;
  onChange: (question: any, list: any) => void;
}

export const QJudge: React.FC<PropInterface> = ({
  question,
  index,
  onChange,
}) => {
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

  useEffect(() => {
    onChange(form, index);
  }, [form.score, form.content, form.answer, form.remark]);

  const onChanging = (e: RadioChangeEvent) => {
    let obj = { ...form };
    obj.answer = parseInt(e.target.value);
    setForm(obj);
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
            defautValue={form.content}
            setContent={(value: string) => {
              let obj = { ...form };
              obj.content = value;
              setForm(obj);
            }}
          ></QuestionQuillEditor>
        </div>
      </div>
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">答案</span>
        </div>
        <div className="float-left">
          <Radio.Group onChange={onChanging} value={parseInt(form.answer)}>
            <Radio value={1}>正确</Radio>
            <Radio value={0}>错误</Radio>
          </Radio.Group>
        </div>
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
