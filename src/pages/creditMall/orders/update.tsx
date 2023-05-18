import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Form, Space, Select } from "antd";
import { creditMall } from "../../../api/index";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, HelperText } from "../../../components";

const CreditMallOrdersUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑积分订单";
    dispatch(titleAction("编辑积分订单"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    getDetail();
  }, [result.get("id")]);

  const getDetail = () => {
    if (id === 0) {
      return;
    }
    creditMall.ordersDetail(id).then((res: any) => {
      var data = res.data;
      form.setFieldsValue({
        user_contact_name: data.user_contact_name,
        user_contact_mobile: data.user_contact_mobile,
        user_contact_address: data.user_contact_address,
        express_number: data.express_number,
      });
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    creditMall
      .ordersUpdate(id, values)
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
      <BackBartment title="编辑积分订单" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="creditMall-orders-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="联系名称"
            name="user_contact_name"
            rules={[{ required: true, message: "请输入联系名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入联系名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="联系手机"
            name="user_contact_mobile"
            rules={[{ required: true, message: "请输入联系手机!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="请输入联系手机"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="联系地址"
            name="user_contact_address"
            rules={[{ required: true, message: "请输入联系地址!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入联系地址"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="运单号"
            name="express_number"
            rules={[{ required: true, message: "请输入运单号!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入运单号"
              allowClear
            />
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

export default CreditMallOrdersUpdatePage;
