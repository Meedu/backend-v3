import { useState, useEffect } from "react";
import { Spin, Form, Input, message, Button, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { system } from "../../../api/index";
import { BackBartment } from "../../../components";

const SystemIOSConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    document.title = "IOS配置";
    dispatch(titleAction("IOS配置"));
    getDetail();
  }, []);

  const getDetail = () => {
    system
      .setting()
      .then((res: any) => {
        let configData = res.data["立春模板"];
        for (let index in configData) {
          if (
            configData[index].key ===
            "meedu.addons.TemplateOne.apple.product_ids"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.apple.product_ids":
                configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.TemplateOne.apple.app_bundle_id"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.apple.app_bundle_id":
                configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.TemplateOne.apple.credit2_name"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.apple.credit2_name":
                configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.TemplateOne.apple.credit2_exchange_rate"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.apple.credit2_exchange_rate":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.TemplateOne.app.ios_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.app.ios_key": configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.TemplateOne.app.ios_free_login"
          ) {
            form.setFieldsValue({
              "meedu.addons.TemplateOne.app.ios_free_login": Number(
                configData[index].value
              ),
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

  const isChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ "meedu.addons.TemplateOne.app.ios_free_login": 1 });
    } else {
      form.setFieldsValue({ "meedu.addons.TemplateOne.app.ios_free_login": 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="IOS配置"></BackBartment>
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
        <div className="float-left">
          <Form
            form={form}
            name="system-IOS-config"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {enabledAddons["TemplateOne"] === 1 && (
              <>
                <div className="from-title mt-30">苹果支付</div>
                <Form.Item
                  label="苹果App BundleID"
                  name="meedu.addons.TemplateOne.apple.app_bundle_id"
                >
                  <Input style={{ width: 300 }} allowClear />
                </Form.Item>
                <Form.Item
                  label="苹果App虚拟货币名"
                  name="meedu.addons.TemplateOne.apple.credit2_name"
                >
                  <Form.Item name="meedu.addons.TemplateOne.apple.credit2_name">
                    <Input style={{ width: 300 }} allowClear />
                  </Form.Item>
                  <div className="form-helper-text">
                    <span>请填写1元人民币换算后的虚拟货币数值</span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="苹果App虚拟货币汇率"
                  name="meedu.addons.TemplateOne.apple.credit2_exchange_rate"
                >
                  <Form.Item name="meedu.addons.TemplateOne.apple.credit2_exchange_rate">
                    <Input style={{ width: 300 }} allowClear />
                  </Form.Item>
                  <div className="form-helper-text">
                    <span>请填写1元人民币换算后的虚拟货币数值</span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="苹果产品id参数"
                  name="meedu.addons.TemplateOne.apple.product_ids"
                >
                  <Input.TextArea rows={3} style={{ width: 300 }} allowClear />
                </Form.Item>
                <div className="from-title mt-30">IOS开发</div>
                <Form.Item
                  label="苹果IOS-应用key"
                  name="meedu.addons.TemplateOne.app.ios_key"
                >
                  <Input style={{ width: 300 }} allowClear />
                </Form.Item>
                <Form.Item
                  label="苹果IOS-游客模式"
                  name="meedu.addons.TemplateOne.app.ios_free_login"
                  valuePropName="checked"
                >
                  <Switch onChange={isChange} />
                </Form.Item>
              </>
            )}
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

export default SystemIOSConfigPage;
