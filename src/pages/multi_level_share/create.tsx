import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Form, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { UploadImageButton, HelperText, BackBartment } from "../../components";

const MultiShareCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [showSelectResWin, setShowSelectResWin] = useState<boolean>(false);

  useEffect(() => {
    document.title = "添加分销课程";
    dispatch(titleAction("添加分销课程"));
  }, []);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    multiShare
      .store(values)
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="添加分销课程" />

      <div className="float-left mt-30">
        <Form
          form={form}
          name="multiShare-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="课程"
            name="goods_id"
            rules={[{ required: true, message: "请选择课程!" }]}
          >
            <Button
              loading={loading}
              type="primary"
              onClick={() => setShowSelectResWin(true)}
            >
              {title && <span>已选择课程「{title}」</span>}
              {!title && <span>选择课程</span>}
            </Button>
          </Form.Item>
          <Form.Item
            label="商品名"
            name="goods_title"
            rules={[{ required: true, message: "请输入商品名!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入商品名"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="goods_charge"
            rules={[{ required: true, message: "请输入商品价格!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="单位：元"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="商品封面"
            name="goods_thumb"
            rules={[{ required: true, message: "请输入商品封面!" }]}
          >
            <UploadImageButton
              text="上传图片"
              onSelected={(url) => {
                form.setFieldsValue({ goods_thumb: url });
                setThumb(url);
              }}
            ></UploadImageButton>
          </Form.Item>
          {thumb && (
            <Form.Item>
              <div
                className="normal-thumb-box"
                style={{
                  backgroundImage: `url(${thumb})`,
                  width: 120,
                  height: 90,
                  marginLeft: 200,
                }}
              ></div>
            </Form.Item>
          )}
          <Form.Item
            label="一级奖励"
            name="reward"
            rules={[{ required: true, message: "请输入一级分销奖励!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="reward"
                rules={[{ required: true, message: "请输入一级分销奖励!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入一级分销奖励"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="最小单位：元。不支持小数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="二级奖励"
            name="reward2"
            rules={[{ required: true, message: "请输入二级分销奖励!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="reward2"
                rules={[{ required: true, message: "请输入二级分销奖励!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入二级分销奖励"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="最小单位：元。不支持小数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="三级奖励"
            name="reward3"
            rules={[{ required: true, message: "请输入三级分销奖励!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="reward3"
                rules={[{ required: true, message: "请输入三级分销奖励!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入三级分销奖励"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="最小单位：元。不支持小数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
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

export default MultiShareCreatePage;
