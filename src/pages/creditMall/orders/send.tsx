import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Form, Space, Select } from "antd";
import { creditMall } from "../../../api/index";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, HelperText } from "../../../components";

const CreditMallOrdersSendPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [user_contact_address, setContactAddress] = useState<string>("");
  const [user_contact_name, setContactName] = useState<string>("");
  const [user_contact_mobile, setContactMobile] = useState<string>("");
  const [id, setId] = useState(Number(result.get("id")));
  const [goodsV, setGoodsV] = useState(Number(result.get("goods_is_v")));

  useEffect(() => {
    document.title = "积分订单发货";
    dispatch(titleAction("积分订单发货"));
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
        express_number: data.express_number,
      });
      setContactAddress(data.user_contact_address);
      setContactMobile(data.user_contact_mobile);
      setContactName(data.user_contact_name);
    });
  };

  const copy = () => {
    var input = document.createElement("input");
    input.value =
      user_contact_address +
      " " +
      user_contact_name +
      " " +
      user_contact_mobile;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
    message.success("复制成功");
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    creditMall
      .ordersSend(id, values)
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
      <BackBartment title="积分订单发货" />
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
          <Form.Item label="收货人地址">
            <div className="d-flex">
              <div className="d-flex">
                {user_contact_address} {user_contact_name}
                {user_contact_mobile}
              </div>
              <div className="ml-30">
                <Button
                  type="link"
                  className="c-primary"
                  onClick={() => copy()}
                >
                  复制
                </Button>
              </div>
            </div>
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
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ required: true, message: "请输入备注!" }]}
          >
            <Input.TextArea
              style={{ width: 500, minHeight: 120 }}
              placeholder="请输入备注"
              allowClear
              maxLength={150}
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

export default CreditMallOrdersSendPage;
