import { useEffect, useState } from "react";
import {
  Form,
  Input,
  message,
  Button,
  Select,
  Space,
  Switch,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { mock } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { HelperText, BackBartment } from "../../../components";

const MockPaperCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState(0);
  const [isInvite, setIsInvite] = useState(0);
  const [charge, setCharge] = useState(0);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const [countMap, setCountMap] = useState<any>({});

  useEffect(() => {
    document.title = "新建模拟试卷";
    dispatch(titleAction("新建模拟试卷"));
    form.setFieldsValue({ is_invite: 0, is_free: 0, is_vip_free: 0 });
    setIsFree(0);
    setIsInvite(0);
  }, []);

  useEffect(() => {
    getParams();
  }, [category_ids]);

  const getParams = () => {
    mock.create({ category_ids: category_ids }).then((res: any) => {
      let categories = res.data.categories;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
      let courses = res.data.question_categories;
      const box2: any = [];
      for (let i = 0; i < courses.length; i++) {
        box2.push({
          label: courses[i].name,
          value: courses[i].id,
        });
      }
      setCourses(box2);
      setCountMap(res.data.count_map);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.is_invite === 0 && values.is_free === 0 && !values.charge) {
      message.error("价格不能为空");
      return;
    }
    if (values.charge < 0) {
      message.error("价格不能为负数");
      return;
    }
    if (
      values.choice > 0 ||
      values.select > 0 ||
      values.input > 0 ||
      values.qa > 0 ||
      values.judge > 0 ||
      values.cap > 0
    ) {
      if (values.choice > countMap[1]) {
        message.error("单选题数量超出可抽取单选题总量");
        return;
      }
      if (values.select > countMap[2]) {
        message.error("多选题数量超出可抽取多选题总量");
        return;
      }
      if (values.input > countMap[3]) {
        message.error("填空题数量超出可抽取填空题总量");
        return;
      }
      if (values.qa > countMap[4]) {
        message.error("问答题数量超出可抽取问答题总量");
        return;
      }
      if (values.judge > countMap[5]) {
        message.error("判断题数量超出可抽取判断题总量");
        return;
      }
      if (values.cap > countMap[6]) {
        message.error("题帽题数量超出可抽取题帽题总量");
        return;
      }
      if (values.choice < 0) {
        message.error("单选题数量不能为负数");
        return;
      }
      if (values.select < 0) {
        message.error("多选题数量不能为负数");
        return;
      }
      if (values.input < 0) {
        message.error("填空题数量不能为负数");
        return;
      }
      if (values.qa < 0) {
        message.error("问答题数量不能为负数");
        return;
      }
      if (values.judge < 0) {
        message.error("判断题数量不能为负数");
        return;
      }
      if (values.cap < 0) {
        message.error("题帽题数量不能为负数");
        return;
      }
      if (values.is_invite === 0 && values.is_free === 1) {
        values.charge = 0;
        setCharge(0);
      }
      if (!values.choice) {
        values.choice = 0;
      }
      if (!values.select) {
        values.select = 0;
      }
      if (!values.judge) {
        values.judge = 0;
      }
      if (!values.input) {
        values.input = 0;
      }
      if (!values.qa) {
        values.qa = 0;
      }
      if (!values.cap) {
        values.cap = 0;
      }
    }
    setLoading(true);
    let rule: any = {
      category_ids: category_ids,
      num: {
        choice: values.choice,
        select: values.select,
        input: values.input,
        qa: values.qa,
        judge: values.judge,
        cap: values.cap,
      },
    };
    let newRule = JSON.stringify(rule);
    mock
      .store({
        rule: newRule,
        pass_score: values.pass_score,
        title: values.title,
        is_vip_free: values.is_vip_free,
        expired_minutes: values.expired_minutes,
        is_invite: values.is_invite,
        charge: charge,
        category_id: values.category_id,
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

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onInviteSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_invite: 1 });
      setIsInvite(1);
    } else {
      form.setFieldsValue({ is_invite: 0 });
      setIsInvite(0);
    }
  };

  const onFreeSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_free: 1, charge: 0 });
      setCharge(0);
      setIsFree(1);
    } else {
      form.setFieldsValue({ is_free: 0 });
      setIsFree(0);
    }
  };

  const onVipSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_vip_free: 1 });
    } else {
      form.setFieldsValue({ is_vip_free: 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建模拟试卷" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="mockPaper-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入试卷标题!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入试卷标题"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="分类"
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
              <Button
                type="link"
                className="c-primary"
                onClick={() => {
                  navigate("/exam/paper/category/index");
                }}
              >
                分类管理
              </Button>
            </Space>
          </Form.Item>
          <Form.Item
            label="时间"
            name="expired_minutes"
            rules={[{ required: true, message: "请输入时间!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="单位：分钟"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="及格分"
            name="pass_score"
            rules={[{ required: true, message: "请输入及格分!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="请输入及格分"
              allowClear
            />
          </Form.Item>
          <Form.Item label="仅添加学员" name="is_invite">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_invite" valuePropName="checked">
                <Switch onChange={onInviteSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="开启仅添加学员的话，只有后台添加的用户可以参与考试"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {isInvite === 0 && (
            <Form.Item label="免费参与" name="is_free">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="is_free" valuePropName="checked">
                  <Switch onChange={onFreeSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="开启所有用户均可直接考试。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          {isFree === 0 && (
            <Form.Item
              label="价格"
              name="charge"
              rules={[{ required: true, message: "请输入价格!" }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="charge"
                  rules={[{ required: true, message: "请输入价格!" }]}
                >
                  <Input
                    onChange={(e) => {
                      setCharge(Number(e.target.value));
                    }}
                    type="number"
                    style={{ width: 300 }}
                    placeholder="单位：元"
                    allowClear
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="请输入整数"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          {charge > 0 && (
            <Form.Item label="VIP免费" name="is_vip_free">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="is_vip_free" valuePropName="checked">
                  <Switch onChange={onVipSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="设置VIP免费的话，则VIP会员用户可以无需购买直接参与考试。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          <Form.Item
            label="试题随机范围"
            name="category_ids"
            rules={[{ required: true, message: "请选择试题范围!" }]}
          >
            <Select
              style={{ width: 300 }}
              allowClear
              mode="multiple"
              placeholder="请选择范围"
              options={courses}
              onChange={(e) => {
                setCategoryIds(e);
              }}
            />
          </Form.Item>
          {category_ids.length > 0 && (
            <>
              <Form.Item label="单选题数量" name="choice">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="choice">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[1]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出的单选题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item label="多选题数量" name="select">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="select">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[2]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出的多选题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item label="判断题数量" name="judge">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="judge">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[5]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出的判断题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item label="填空题数量" name="input">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="input">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[3]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出填空题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item label="问答题数量" name="qa">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="qa">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[4]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出问答题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item label="题帽题数量" name="cap">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="cap">
                    <Input
                      type="number"
                      style={{ width: 300 }}
                      placeholder="请输入整数"
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <span>（共{countMap[6]}题）</span>
                  </div>
                  <div className="ml-10">
                    <HelperText text="每次考试抽出题帽题数量"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
      <div className="bottom-menus">
        <div className="bottom-menus-box">
          <div>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
            >
              保存
            </Button>
          </div>
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

export default MockPaperCreatePage;
