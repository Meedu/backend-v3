import { useState, useEffect } from "react";
import { Spin, Form, Input, message, Button, Switch, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { system } from "../../../api/index";
import { checkUrl } from "../../../utils/index";
import { BackBartment } from "../../../components";

const SystemLiveConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(true);
  const [appUrl, setAppUrl] = useState<string>("");
  const [aliWebUrl, setAliWebUrl] = useState<string>("");
  const [tenWebUrl, setTenWebUrl] = useState<string>("");
  const selects = [
    {
      value: "aliyun",
      label: "阿里云直播",
    },
    {
      value: "tencent",
      label: "腾讯云直播",
    },
  ];
  const options = [
    { label: "阿里云OSS", value: "oss" },
    { label: "腾讯云COS", value: "cos" },
  ];

  useEffect(() => {
    document.title = "直播服务配置";
    dispatch(titleAction("直播服务配置"));
    getDetail();
  }, []);

  useEffect(() => {
    if (appUrl) {
      setAliWebUrl(
        "回调地址：" + appUrl + "addons/zhibo/api/v1/aliyun/callback"
      );
      setTenWebUrl(
        "回调地址：" + appUrl + "addons/zhibo/api/v1/tencent/callback"
      );
    }
  }, [appUrl]);

  const getDetail = () => {
    system
      .setting()
      .then((res: any) => {
        let configData = res.data["直播"];
        for (let index in configData) {
          if (configData[index].key === "meedu.addons.zhibo.default_service") {
            form.setFieldsValue({
              "meedu.addons.zhibo.default_service": configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.zhibo.default_attach_service"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.default_attach_service":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.play_domain"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.play_domain": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.push_domain"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.push_domain": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.access_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.access_key": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.access_secret"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.access_secret":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.play_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.play_key": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.push_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.push_key": configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.zhibo.aliyun.record.callback.key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.record.callback.key":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.record.region"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.record.region":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.app_id"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.app_id": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.secret_id"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.secret_id": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.secret_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.secret_key": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.play_domain"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.play_domain": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.push_domain"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.push_domain": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.play_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.play_key": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.push_key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.push_key": configData[index].value,
            });
          } else if (
            configData[index].key ===
            "meedu.addons.zhibo.tencent.record.callback.key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.record.callback.key":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.tencent.webrtc_play"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.tencent.webrtc_play": Number(
                configData[index].value
              ),
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.aliyun.rts_play"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.aliyun.rts_play": Number(
                configData[index].value
              ),
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.go-meedu.internal_url"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.go-meedu.internal_url":
                configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.go-meedu.url"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.go-meedu.url": configData[index].value,
            });
          } else if (
            configData[index].key === "meedu.addons.zhibo.go-meedu.key"
          ) {
            form.setFieldsValue({
              "meedu.addons.zhibo.go-meedu.key": configData[index].value,
            });
          }
        }

        let configSysData = res.data["系统"];

        for (let index in configSysData) {
          if (configSysData[index].key === "app.url") {
            let appUrl = checkUrl(configSysData[index].value);
            setAppUrl(appUrl);
            break;
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
        if (result.get("referer")) {
          navigate(String(result.get("referer")), { replace: true });
        } else {
          navigate(-1);
        }
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
      form.setFieldsValue({ "meedu.addons.zhibo.tencent.webrtc_play": 1 });
    } else {
      form.setFieldsValue({ "meedu.addons.zhibo.tencent.webrtc_play": 0 });
    }
  };

  const isRtsChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ "meedu.addons.zhibo.aliyun.rts_play": 1 });
    } else {
      form.setFieldsValue({ "meedu.addons.zhibo.aliyun.rts_play": 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="直播服务配置"></BackBartment>{" "}
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
            name="system-player-config"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="from-title mt-30">服务商配置</div>
            <Form.Item
              label="直播服务商"
              name="meedu.addons.zhibo.default_service"
            >
              <Select style={{ width: 300 }} allowClear options={selects} />
            </Form.Item>
            <Form.Item
              label="直播课件存储服务商"
              name="meedu.addons.zhibo.default_attach_service"
            >
              <Select style={{ width: 300 }} allowClear options={options} />
            </Form.Item>
            <div className="from-title mt-30">阿里云直播服务商配置</div>
            <Form.Item
              label="阿里云播流域名"
              name="meedu.addons.zhibo.aliyun.play_domain"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云推流域名"
              name="meedu.addons.zhibo.aliyun.push_domain"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云AccessKeyId"
              name="meedu.addons.zhibo.aliyun.access_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云AccessKeySecret"
              name="meedu.addons.zhibo.aliyun.access_secret"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云PlayKey"
              name="meedu.addons.zhibo.aliyun.play_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云PushKey"
              name="meedu.addons.zhibo.aliyun.push_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="阿里云录制回调key"
              name="meedu.addons.zhibo.aliyun.record.callback.key"
            >
              <Form.Item name="meedu.addons.zhibo.aliyun.record.callback.key">
                <Input style={{ width: 300 }} allowClear />
              </Form.Item>
              <div className="form-helper-text">
                <span>{aliWebUrl}</span>
              </div>
            </Form.Item>
            <Form.Item
              label="启用RTS播放"
              name="meedu.addons.zhibo.aliyun.rts_play"
            >
              <Form.Item
                name="meedu.addons.zhibo.aliyun.rts_play"
                valuePropName="checked"
              >
                <Switch onChange={isRtsChange} />
              </Form.Item>
              <div className="form-helper-text">
                <span>该播放方式毫秒级延迟。</span>
              </div>
            </Form.Item>
            <div className="from-title mt-30">腾讯云直播服务商配置</div>
            <Form.Item
              label="腾讯云AppId"
              name="meedu.addons.zhibo.tencent.app_id"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云SecretId"
              name="meedu.addons.zhibo.tencent.secret_id"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云SecretKey"
              name="meedu.addons.zhibo.tencent.secret_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云播流域名"
              name="meedu.addons.zhibo.tencent.play_domain"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云推流域名"
              name="meedu.addons.zhibo.tencent.push_domain"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云PlayKey"
              name="meedu.addons.zhibo.tencent.play_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云PushKey"
              name="meedu.addons.zhibo.tencent.push_key"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="腾讯云录制回调秘钥"
              name="meedu.addons.zhibo.tencent.record.callback.key"
            >
              <Form.Item name="meedu.addons.zhibo.tencent.record.callback.key">
                <Input style={{ width: 300 }} allowClear />
              </Form.Item>
              <div className="form-helper-text">
                <span>{tenWebUrl}</span>
              </div>
            </Form.Item>
            <Form.Item
              label="腾讯云WebRtc播放"
              name="meedu.addons.zhibo.tencent.webrtc_play"
            >
              <Form.Item
                name="meedu.addons.zhibo.tencent.webrtc_play"
                valuePropName="checked"
              >
                <Switch onChange={isChange} />
              </Form.Item>
              <div className="form-helper-text">
                <span>该播放方式毫秒级延迟。</span>
              </div>
            </Form.Item>
            <div className="from-title mt-30">直播间聊天服务配置</div>
            <Form.Item
              label="聊天服务内网地址"
              name="meedu.addons.zhibo.go-meedu.internal_url"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="聊天服务外网地址"
              name="meedu.addons.zhibo.go-meedu.url"
            >
              <Input style={{ width: 300 }} allowClear />
            </Form.Item>
            <Form.Item
              label="聊天服务Key"
              name="meedu.addons.zhibo.go-meedu.key"
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

export default SystemLiveConfigPage;
