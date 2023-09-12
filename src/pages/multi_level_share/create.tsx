import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Form, Space, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  UploadImageButton,
  HelperText,
  BackBartment,
  SelectResources,
} from "../../components";

const MultiShareCreatePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [goods_type, setGoodsType] = useState<string>("");
  const [showSelectResWin, setShowSelectResWin] = useState<boolean>(false);

  useEffect(() => {
    document.title = "新建分销活动";
    dispatch(titleAction("新建分销活动"));
  }, []);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.goods_type = goods_type;
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
      <BackBartment title="新建分销活动" />
      <SelectResources
        open={showSelectResWin}
        enabledResource={"vod,live,book,topic,paper,practice,learnPath,vip"}
        onCancel={() => setShowSelectResWin(false)}
        onSelected={(result: any) => {
          form.setFieldsValue({
            goods_id: result.id,
            goods_title: result.title,
            goods_charge: result.original_charge,
            goods_thumb: result.thumb,
          });
          setTitle(result.title);
          setThumb(result.thumb);
          setGoodsType(result.resource_type);
          setShowSelectResWin(false);
        }}
      ></SelectResources>
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
            rules={[{ required: true, message: "请上传商品封面!" }]}
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
            <Row style={{ marginBottom: 22 }}>
              <Col span={3}></Col>
              <Col span={21}>
                <div
                  className="normal-thumb-box"
                  style={{
                    backgroundImage: `url(${thumb})`,
                    width: 120,
                    height: 90,
                  }}
                ></div>
              </Col>
            </Row>
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
