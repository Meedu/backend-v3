import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Form,
  Tabs,
  Switch,
  Space,
  Row,
  Col,
  Spin,
} from "antd";
import { useDispatch } from "react-redux";
import { creditMall } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  BackBartment,
  UploadImageButton,
  HelperText,
  QuillEditor,
} from "../../components";

const CreditMallUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [resourceActive, setResourceActive] = useState<string>("base");
  const [defautValue, setDefautValue] = useState("");
  const [title, setTitle] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [is_v, setIsV] = useState(0);
  const [v_id, setVId] = useState(0);
  const [type, setType] = useState("");
  const [id, setId] = useState(Number(result.get("id")));
  const types = [
    {
      key: "base",
      label: "基础信息",
    },
    {
      key: "dev",
      label: "可选信息",
    },
  ];

  useEffect(() => {
    document.title = "编辑积分商品";
    dispatch(titleAction("编辑积分商品"));
    initData();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  const initData = async () => {
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await creditMall.detail(id);
    var data = res.data;
    form.setFieldsValue({
      v_id: data.v_id,
      title: data.title,
      thumb: data.thumb,
      is_show: data.is_show,
      desc: data.desc,
      stock_count: data.stock_count,
      charge: data.charge,
    });
    setThumb(data.thumb);
    setTitle(data.title);
    setIsV(data.is_v);
    setVId(data.v_id);
    setType(data.v_type);
    setDefautValue(data.desc);
  };

  const onChange = (key: string) => {
    setResourceActive(key);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    values.is_v = is_v;
    values.v_id = v_id;
    values.v_type = type;
    setLoading(true);
    creditMall
      .update(id, values)
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

  const onSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_show: 1 });
    } else {
      form.setFieldsValue({ is_show: 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑积分商品" />
      <div className="center-tabs mb-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
      </div>
      {init && (
        <div className="float-left text-center">
          <Spin></Spin>
        </div>
      )}
      <div style={{ display: init ? "none" : "block" }} className="float-left">
        <Form
          form={form}
          name="creditMall-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div
            style={{ display: resourceActive === "base" ? "block" : "none" }}
          >
            <Form.Item
              label="商品名"
              name="title"
              rules={[{ required: true, message: "请输入商品名!" }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="请输入商品名"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="商品封面"
              name="thumb"
              rules={[{ required: true, message: "请上传商品封面!" }]}
            >
              <UploadImageButton
                text="上传封面"
                onSelected={(url) => {
                  form.setFieldsValue({ thumb: url });
                  setThumb(url);
                }}
              ></UploadImageButton>
            </Form.Item>
            {thumb && (
              <Row style={{ marginBottom: 22 }}>
                <Col span={3}></Col>
                <Col span={21}>
                  <div
                    className="contain-thumb-box"
                    style={{
                      backgroundImage: `url(${thumb})`,
                      width: 400,
                      height: 400,
                      backgroundColor: "#f4fafe",
                    }}
                  ></div>
                </Col>
              </Row>
            )}
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
                    style={{ width: 300 }}
                    placeholder="单位：积分"
                    allowClear
                    type="number"
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="价格最小单位为：积分，不支持小数"></HelperText>
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              label="介绍"
              name="desc"
              rules={[{ required: true, message: "请输入介绍!" }]}
              style={{ height: 440 }}
            >
              <QuillEditor
                mode=""
                height={400}
                defautValue={defautValue}
                isFormula={false}
                setContent={(value: string) => {
                  form.setFieldsValue({ desc: value });
                }}
              ></QuillEditor>
            </Form.Item>
            <Form.Item
              label="库存"
              name="stock_count"
              rules={[{ required: true, message: "请输入库存!" }]}
            >
              <Input
                type="number"
                style={{ width: 300 }}
                placeholder="商品库存数量"
                allowClear
              />
            </Form.Item>
          </div>
          <div style={{ display: resourceActive === "dev" ? "block" : "none" }}>
            <Form.Item label="显示" name="is_show">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="is_show" valuePropName="checked">
                  <Switch onChange={onSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="控制用户是否能看到该商品"></HelperText>
                </div>
              </Space>
            </Form.Item>
          </div>
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

export default CreditMallUpdatePage;
