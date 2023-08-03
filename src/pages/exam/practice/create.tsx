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
import { useDispatch, useSelector } from "react-redux";
import { practice } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { HelperText, BackBartment } from "../../../components";

const PracticeCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [charge, setCharge] = useState(0);
  const [isFree, setIsFree] = useState(0);
  const [visiable, setVisiable] = useState<boolean>(false);

  useEffect(() => {
    document.title = "新建练习";
    dispatch(titleAction("新建练习"));
    form.setFieldsValue({ is_free: 0, is_vip_free: 0 });
    setIsFree(0);
    getParams();
  }, []);

  const getParams = () => {
    practice.create().then((res: any) => {
      let categories = res.data.categories;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.is_free === 1) {
      values.charge = 0;
    }
    if (Number(values.charge) % 1 !== 0) {
      message.error("价格必须为整数型");
      return;
    }
    if (values.is_free === 0 && Number(values.charge) <= 0) {
      message.error("练习未设置免费时价格应该大于0");
      return;
    }
    setLoading(true);
    practice
      .store(values)
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
      form.setFieldsValue({ is_vip_free: 1 });
    } else {
      form.setFieldsValue({ is_vip_free: 0 });
    }
  };

  const onFreeSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_free: 1, is_vip_free: 0 });
      setIsFree(1);
      setCharge(0);
    } else {
      form.setFieldsValue({ is_free: 0 });
      setIsFree(0);
    }
  };

  const goVideo = () => {
    practice
      .list({
        page: 1,
        size: 10,
        sort: "id",
        order: "desc",
      })
      .then((res: any) => {
        navigate(
          "/exam/practice/chapter/index?id=" + res.data.data.data[0].id,
          { replace: true }
        );
      });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建练习" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="practice-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
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
            label="练习名"
            name="name"
            rules={[{ required: true, message: "请输入练习名!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入练习名"
              allowClear
            />
          </Form.Item>
          <Form.Item label="免费" name="is_free">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_free" valuePropName="checked">
                <Switch onChange={onFreeSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="开启免费的话所有用户都可直接参与练习。"></HelperText>
              </div>
            </Space>
          </Form.Item>
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
                    type="number"
                    style={{ width: 300 }}
                    placeholder="单位：元"
                    allowClear
                    onChange={(e) => {
                      setCharge(Number(e.target.value));
                    }}
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
                  <Switch onChange={onSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="开启VIP会员免费的话，VIP用户将直接参与练习。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
        </Form>
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
              navigate("/exam/practice/index", { replace: true });
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
              <span>
                新建练习成功，请在添加章节后再在试题库中选择试题组卷吧！
              </span>
            </div>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default PracticeCreatePage;
