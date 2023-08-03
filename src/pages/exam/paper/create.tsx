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
import { paper } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { HelperText, BackBartment } from "../../../components";

const PaperCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState(0);
  const [charge, setCharge] = useState(0);
  const [isInvite, setIsInvite] = useState(0);
  const [categories, setCategories] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const [visiable, setVisiable] = useState<boolean>(false);

  useEffect(() => {
    document.title = "新建试卷";
    dispatch(titleAction("新建试卷"));
    form.setFieldsValue({
      enabled_invite: 0,
      is_free: 0,
      is_skip_mark: 0,
      is_vip_free: 0,
      is_random: 0,
    });
    setIsFree(0);
    setIsInvite(0);
    getParams();
  }, []);
  const getParams = () => {
    paper.create().then((res: any) => {
      let categories = res.data.categories;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
      let courses = res.data.courses;
      const box2: any = [];
      for (let i = 0; i < courses.length; i++) {
        box2.push({
          label: courses[i].title,
          value: courses[i].id,
        });
      }
      setCourses(box2);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.enabled_invite === 0 && values.is_free === 0 && !values.charge) {
      message.error("价格不能为空");
      return;
    }
    if (
      values.enabled_invite === 0 &&
      values.is_free === 0 &&
      parseInt(values.charge) === 0 &&
      ((values.required_courses && values.required_courses.length === 0) ||
        !values.required_courses)
    ) {
      message.error("设置价格大于0或者设置有购买录播课程");
      return;
    }
    setLoading(true);
    const ids = values.required_courses && values.required_courses.join(",");
    paper
      .store({
        rule: values.newRule,
        pass_score: values.pass_score,
        title: values.title,
        is_skip_mark: values.is_skip_mark,
        expired_minutes: values.expired_minutes,
        enabled_invite: values.enabled_invite,
        charge: charge,
        is_free: isFree,
        required_courses: ids,
        is_vip_free: values.is_vip_free || 0,
        is_random: values.is_random || 0,
        category_id: values.category_id,
        try_times: values.try_times,
      })
      .then((res: any) => {
        setLoading(false);
        setVisiable(true);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_skip_mark: 1 });
    } else {
      form.setFieldsValue({ is_skip_mark: 0 });
    }
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

  const goVideo = () => {
    paper
      .list({
        page: 1,
        size: 10,
        sort: "id",
        order: "desc",
      })
      .then((res: any) => {
        navigate("/exam/paper/question?id=" + res.data.data.data[0].id, {
          replace: true,
        });
      });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建试卷" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="paper-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="试卷名"
            name="title"
            rules={[{ required: true, message: "请输入试卷名!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入试卷名"
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
            label="考试次数"
            name="try_times"
            rules={[{ required: true, message: "请输入考试次数!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="try_times"
                rules={[{ required: true, message: "请输入考试次数!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入整数"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="可限制用户可考次数。填写0的话意味着不限制考试次数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="跳过阅卷" name="is_skip_mark">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_skip_mark" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="若试卷中包含问答题，将自动跳过问答题阅卷生成总成绩。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="仅添加学员" name="enabled_invite">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="enabled_invite" valuePropName="checked">
                <Switch onChange={onInviteSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="只有在后台添加的用户才可以参与考试。该使用场景如：老师指定的一批学生科参与考试。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {isInvite === 0 && (
            <>
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
              {isFree === 0 && (
                <>
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
                  {charge > 0 && (
                    <Form.Item label="VIP免费" name="is_vip_free">
                      <Space align="baseline" style={{ height: 32 }}>
                        <Form.Item name="is_vip_free" valuePropName="checked">
                          <Switch onChange={onVipSwitch} />
                        </Form.Item>
                        <div className="ml-10">
                          <HelperText text="VIP会员可无需购买直接参与考试。"></HelperText>
                        </div>
                      </Space>
                    </Form.Item>
                  )}
                  <Form.Item label="购买录播课程" name="required_courses">
                    <Space align="baseline" style={{ height: 32 }}>
                      <Form.Item name="required_courses">
                        <Select
                          style={{ width: 300 }}
                          allowClear
                          mode="multiple"
                          placeholder="请选择购买录播课程"
                          options={courses}
                        />
                      </Form.Item>
                      <div className="ml-10">
                        <HelperText text="购买指定的录播课程可直接参与考试。"></HelperText>
                      </div>
                    </Space>
                  </Form.Item>
                </>
              )}
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
      {visiable ? (
        <Modal
          title=""
          onCancel={() => {
            setVisiable(false);
            navigate("/exam/paper/index", { replace: true });
          }}
          cancelText="暂不组卷"
          okText="立即组卷"
          open={true}
          width={500}
          maskClosable={false}
          onOk={() => {
            setVisiable(false);
            goVideo();
          }}
          centered
        >
          <div
            className="text-center"
            style={{ marginTop: 30, marginBottom: 30 }}
          >
            <span>新建考试成功，请在试题库中选择试题组卷吧！</span>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default PaperCreatePage;
