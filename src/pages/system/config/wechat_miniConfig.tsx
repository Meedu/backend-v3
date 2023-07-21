import { useState, useEffect } from "react";
import { Spin, Form, Input, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { system } from "../../../api/index";
import { BackBartment } from "../../../components";

const SystemWechatMiniConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "微信小程序";
    dispatch(titleAction("微信小程序"));
    getDetail();
  }, []);

  const getDetail = () => {
    system
      .setting()
      .then((res: any) => {
        let configData = res.data["微信小程序"];
        for (let index in configData) {
          if (
            configData[index].key ===
            "meedu.addons.TemplateOne.wechat_mini.app_id"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.wechat_mini.app_id":
                configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.TemplateOne.wechat_mini.secret"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.wechat_mini.secret":
                configData[index].value,
            });
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    system
      .saveSetting({
        config: values,
      })
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        getDetail();
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
      <BackBartment title="微信小程序"></BackBartment>
      {loading && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            paddingTop: 50,
            paddingBottom: 30,
            boxSizing: "border-box",
          }}
        >
          <Spin />
        </div>
      )}
      {!loading && (
        <div className="float-left mt-30">
          <Form
            form={form}
            name="system-wechatmini-config"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="AppId"
              name="meedu.addons.TemplateOne.wechat_mini.app_id"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="Secret"
              name="meedu.addons.TemplateOne.wechat_mini.secret"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
          </Form>
        </div>
      )}
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

export default SystemWechatMiniConfigPage;
