import React, { useState, useEffect } from "react";
import { QuestionQuillEditor, CloseIcon } from "../../../../components";
import { Modal, Select, Button, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { QChoice } from "./choice";
import { QSelect } from "./select";
import { QJudge } from "./judge";
import { QInput } from "./input";
import { QQa } from "./qa";
const { confirm } = Modal;

interface PropInterface {
  question: any;
  onChange: (question: any, list: any) => void;
}

export const QCap: React.FC<PropInterface> = ({ question, onChange }) => {
  const [header, setHeader] = useState<any>(
    question ? JSON.parse(question.content).header : null
  );
  const [list, setList] = useState<any>(
    question ? JSON.parse(question.content).questions : []
  );
  const [form, setForm] = useState<any>(
    question
      ? question
      : {
          content: null,
          answer: null,
          score: null,
          remark: null,
        }
  );
  const [addForm, setAddForm] = useState<any>({
    type: null,
  });
  const types = [
    { label: "单选", value: 1 },
    { label: "多选", value: 2 },
    { label: "判断", value: 5 },
    { label: "填空", value: 3 },
    { label: "问答", value: 4 },
  ];

  useEffect(() => {
    update();
  }, [form.remark, , header]);

  const add = () => {
    if (!addForm.type) {
      message.warning("请选择添加的试题类型");
      return;
    }

    let data = {
      type: addForm.type,
      content: null,
      answer: null,
      score: null,
      remark: null,
    };
    switch (addForm.type) {
      case 1:
        Object.assign(data, {
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
        });
        break;
      case 2:
        Object.assign(data, {
          answer: [],
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
        });
        break;
    }
    let arr = [...list];
    arr.push(data);
    setList(arr);
    let obj = { ...addForm };
    obj.type = null;
    setAddForm(obj);
  };

  const remove = (index: number) => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中试题？",
      centered: true,
      okText: "确认删除",
      cancelText: "取消",
      onOk() {
        let arr = [...list];
        arr.splice(index, 1);
        setList(arr);
        update();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const update = () => {
    // 分数统计
    let score = 0;
    list.forEach((item: any) => {
      if (typeof item.score === "undefined" || item.score === null) {
        return;
      }
      score += parseInt(item.score);
    });
    let obj = { ...form };
    obj.score = score;
    obj.content = JSON.stringify({
      header: header,
      questions: list,
    });
    setForm(obj);
    onChange(obj, list);
  };

  const change = (question: any, index: any) => {
    if (question.type === 2 && Array.isArray(question.answer)) {
      question.answer = question.answer.join(",");
    }
    let arr = [...list];
    Object.assign(arr[index], question);
    setList(arr);
    update();
  };

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span className="c-red">*</span>
          <span className="ml-5">题帽</span>
        </div>
        <div className="float-left">
          <QuestionQuillEditor
            isFormula={true}
            height={40}
            defautValue={header}
            setContent={(value: string) => {
              setHeader(value);
            }}
          ></QuestionQuillEditor>
        </div>
      </div>
      {list.length > 0 &&
        list.map((item: any, index: number) => (
          <div className="question-item" key={index}>
            <div className="btn-close" onClick={() => remove(index)}>
              <CloseIcon></CloseIcon>
            </div>
            <div className="float-left mb-15 helper-label">
              {item.type === 1 && <span>单选题</span>}
              {item.type === 2 && <span>多选题</span>}
              {item.type === 3 && <span>填空题</span>}
              {item.type === 4 && <span>问答题</span>}
              {item.type === 5 && <span>判断题</span>}
            </div>
            {item.type === 1 && (
              <QChoice
                question={item}
                index={index}
                onChange={(question: any, list: any) => change(question, list)}
              ></QChoice>
            )}
            {item.type === 2 && (
              <QSelect
                question={item}
                index={index}
                onChange={(question: any, list: any) => change(question, list)}
              ></QSelect>
            )}
            {item.type === 3 && (
              <QInput
                question={item}
                index={index}
                onChange={(question: any, list: any) => change(question, list)}
              ></QInput>
            )}
            {item.type === 4 && (
              <QQa
                question={item}
                index={index}
                onChange={(question: any, list: any) => change(question, list)}
              ></QQa>
            )}
            {item.type === 5 && (
              <QJudge
                question={item}
                index={index}
                onChange={(question: any, list: any) => change(question, list)}
              ></QJudge>
            )}
          </div>
        ))}
      <div className="float-left mt-15 mb-15">
        <div className="d-flex">
          <div>
            <Select
              style={{ width: 400 }}
              value={addForm.type}
              onChange={(e) => {
                let obj = { ...addForm };
                obj.type = e;
                setAddForm(obj);
              }}
              allowClear
              placeholder="试题类型"
              options={types}
            />
          </div>
          <div className="ml-10">
            <Button type="primary" onClick={() => add()}>
              新增子题
            </Button>
          </div>
        </div>
      </div>
      <div className="float-left mb-15">
        <div className="float-left helper-label mb-10">
          <span>总分</span>
        </div>
        <div className="float-left">
          <span>{form.score || 0}分</span>
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
