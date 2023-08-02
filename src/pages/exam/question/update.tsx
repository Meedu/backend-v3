import { useEffect, useState } from "react";
import { Form, message, Button, Select, Space, Steps, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { question } from "../../../api/index";
import { QChoice } from "./components/choice";
import { QSelect } from "./components/select";
import { QJudge } from "./components/judge";
import { QInput } from "./components/input";
import { QQa } from "./components/qa";
import { QCap } from "./components/cap";

const QuestionUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState<any>([]);
  const [type, setType] = useState<any>([]);
  const [levels, setLevels] = useState<any>([]);
  const [formParams, setFormParams] = useState<any>({});
  const [capList, setCapList] = useState<any>(null);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑试题";
    dispatch(titleAction("编辑试题"));
    initData();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  const initData = async () => {
    await getParams();
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await question.detail(id);
    var data = res.data.data;
    form.setFieldsValue({
      category_id: data.category_id,
      level: data.level,
    });
    setType(data.type);
    setCurrent(1);
    setFormParams({
      category_id: data.category_id,
      level: data.level,
      type: data.type,
      content: data.content,
      score: data.score,
      answer: data.answer,
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      option5: data.option5,
      option6: data.option6,
      option7: data.option7,
      option8: data.option8,
      option9: data.option9,
      option10: data.option10,
      remark: data.remark,
    });
  };

  const getParams = async () => {
    const res: any = await question.create();
    let box1: any = [];
    res.data.categories.length > 0 &&
      res.data.categories.map((item: any) => {
        box1.push({
          label: item.name,
          value: item.id,
        });
      });
    setCategories(box1);
    let box3: any = [];
    res.data.levels.length > 0 &&
      res.data.levels.map((item: any) => {
        box3.push({
          label: item.name,
          value: item.id,
        });
      });
    setLevels(box3);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = { ...formParams };
    params.category_id = values.category_id;
    params.level = values.level;
    setFormParams(params);
    setCurrent(current + 1);
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const save = () => {
    if (loading) {
      return;
    }
    if (
      (formParams.type === 1 || formParams.type === 2) &&
      !formParams.option2
    ) {
      message.error("至少得有两个选项");
      return;
    }
    if (formParams.type === 6 && capList) {
      let status = false;
      capList.forEach((item: any, index: number) => {
        let num = index + 1;
        if (typeof item.score === "undefined" || item.score === null) {
          message.error("请填写第" + num + "题子题分数");
          status = true;
          return;
        }
      });
      if (status) {
        return;
      }
    }
    if (formParams.type === 6 && !formParams.score) {
      message.warning("请至少添加一个子题");
      return;
    }
    if (formParams.type === 3 && !formParams.score) {
      message.warning("请填写每空分数");
      return;
    }
    if (!formParams.score) {
      message.warning("试题分数不能为空");
      return;
    }
    if (!formParams.content) {
      message.warning("试题内容不能为空");
      return;
    }
    if (
      (formParams.type === 1 ||
        formParams.type === 3 ||
        formParams.type === 5) &&
      formParams.answer === null
    ) {
      message.warning("试题答案不能为空");
      return;
    }

    if (formParams.type === 2 && formParams.answer.length === 0) {
      message.warning("试题答案不能为空");
      return;
    }
    setLoading(true);
    question
      .update(id, formParams)
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        navigate(-1);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const change = (question: any, list: any) => {
    let obj = { ...formParams };
    Object.assign(obj, question);
    setFormParams(obj);
    if (list) {
      setCapList(list);
    } else {
      setCapList(null);
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑试题" />
      <div className="float-left step-box mb-30 mt-30">
        <Steps
          current={current}
          items={[
            {
              title: "确认试题类型",
            },
            {
              title: "完善试题信息",
            },
          ]}
        />
      </div>
      {init && (
        <div className="float-left text-center">
          <Spin></Spin>
        </div>
      )}
      <div
        className="float-left"
        style={{ display: !init && current === 0 ? "block" : "none" }}
      >
        <Form
          form={form}
          name="question-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="所属分类"
            name="category_id"
            rules={[{ required: true, message: "请选择分类!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="category_id"
                rules={[{ required: true, message: "请选择分类!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择分类"
                  options={categories}
                />
              </Form.Item>

              <PerButton
                type="link"
                text="分类管理"
                class="c-primary"
                icon={null}
                p="addons.Paper.question_category.list"
                onClick={() => {
                  navigate("/exam/question/category/index");
                }}
                disabled={null}
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="试题难度"
            name="level"
            rules={[{ required: true, message: "请选择试题难度!" }]}
          >
            <Select
              style={{ width: 300 }}
              allowClear
              placeholder="请选择试题难度"
              options={levels}
            />
          </Form.Item>
        </Form>
      </div>
      {!init && current === 1 && (
        <div className="float-left pl-200">
          {type === 1 && (
            <QChoice
              question={formParams}
              index={null}
              onChange={(question: any, list: any) => change(question, list)}
            ></QChoice>
          )}
          {type === 2 && (
            <QSelect
              question={formParams}
              index={null}
              onChange={(question: any, list: any) => change(question, list)}
            ></QSelect>
          )}
          {type === 3 && (
            <QInput
              question={formParams}
              index={null}
              onChange={(question: any, list: any) => change(question, list)}
            ></QInput>
          )}
          {type === 4 && (
            <QQa
              question={formParams}
              index={null}
              onChange={(question: any, list: any) => change(question, list)}
            ></QQa>
          )}
          {type === 5 && (
            <QJudge
              question={formParams}
              index={null}
              onChange={(question: any, list: any) => change(question, list)}
            ></QJudge>
          )}
          {type === 6 && (
            <QCap
              question={formParams}
              onChange={(question: any, list: any) => change(question, list)}
            ></QCap>
          )}
        </div>
      )}
      <div className="bottom-menus">
        <div className="bottom-menus-box">
          <div>
            {current === 1 && (
              <Button loading={loading} type="primary" onClick={() => save()}>
                保存
              </Button>
            )}
            {current === 0 && (
              <Button loading={loading} onClick={() => form.submit()}>
                下一步
              </Button>
            )}
          </div>
          {current === 1 && (
            <div className="ml-24">
              <Button onClick={() => setCurrent(0)}>上一步</Button>
            </div>
          )}
          <div className="ml-24">
            <Button type="default" onClick={() => navigate(-1)}>
              取消
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionUpdatePage;
