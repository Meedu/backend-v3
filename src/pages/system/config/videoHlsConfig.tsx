import { useState, useEffect } from "react";
import { Spin, Form, Input, message, Button, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { system } from "../../../api/index";
import { BackBartment } from "../../../components";

const SystemvVideoHlsConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(true);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );
  const regions = [
    {
      label: "亚太东南(曼谷)",
      value: "ap-bangkok",
    },
    {
      label: "华北地区(北京)",
      value: "ap-beijing",
    },
    {
      label: "西南地区(成都)",
      value: "ap-chengdu",
    },
    {
      label: "西南地区(重庆)",
      value: "ap-chongqing",
    },
    {
      label: "华南地区(广州)",
      value: "ap-guangzhou",
    },
    {
      label: "港澳台地区(中国香港)",
      value: "ap-hongkong",
    },
    {
      label: "亚太南部(孟买)",
      value: "ap-mumbai",
    },
    {
      label: "亚太东北(首尔)",
      value: "ap-seoul",
    },
    {
      label: "华东地区(上海)",
      value: "ap-shanghai",
    },
    {
      label: "华东地区(上海金融)",
      value: "ap-shanghai-fsi",
    },
    {
      label: "华南地区(深圳金融)",
      value: "ap-shenzhen-fsi",
    },
    {
      label: "亚太东南(新加坡)",
      value: "ap-singapore",
    },
    {
      label: "亚太东北(东京)",
      value: "ap-tokyo",
    },
    {
      label: "欧洲地区(法兰克福)",
      value: "eu-frankfurt",
    },
    {
      label: "欧洲地区(莫斯科)",
      value: "eu-moscow",
    },
    {
      label: "美国东部(弗吉尼亚)",
      value: "na-ashburn",
    },
    {
      label: "美国西部(硅谷)",
      value: "na-siliconvalley",
    },
    {
      label: "北美地区(多伦多)",
      value: "na-toronto",
    },
  ];

  const definition = [
    {
      label: "流畅",
      value: "210",
    },
    {
      label: "标清",
      value: "220",
    },
    {
      label: "高清",
      value: "230",
    },
    {
      label: "超清",
      value: "240",
    },
    {
      label: "2K",
      value: "270",
    },
    {
      label: "4K",
      value: "280",
    },
  ];

  useEffect(() => {
    document.title = "视频加密";
    dispatch(titleAction("视频加密"));
    getDetail();
  }, []);

  const getDetail = () => {
    system
      .setting()
      .then((res: any) => {
        if (enabledAddons["AliyunHls"] === 1) {
          let configData = res.data["阿里云HLS加密"];
          for (let index in configData) {
            if (configData[index].key === "meedu.addons.AliyunHls.region") {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.region": configData[index].value,
              });
            } else if (
              configData[index].key === "meedu.addons.AliyunHls.template_id"
            ) {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.template_id": configData[index].value,
              });
            } else if (
              configData[index].key === "meedu.addons.AliyunHls.access_key"
            ) {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.access_key": configData[index].value,
              });
            } else if (
              configData[index].key === "meedu.addons.AliyunHls.access_secret"
            ) {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.access_secret": configData[index].value,
              });
            } else if (
              configData[index].key === "meedu.addons.AliyunHls.kms_region"
            ) {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.kms_region": configData[index].value,
              });
            } else if (
              configData[index].key === "meedu.addons.AliyunHls.kms_key_id"
            ) {
              form.setFieldsValue({
                "meedu.addons.AliyunHls.kms_key_id": configData[index].value,
              });
            }
          }
        }
        if (enabledAddons["TencentCloudHls"] === 1) {
          let configTenData = res.data["腾讯云HLS加密"];
          for (let index in configTenData) {
            if (
              configTenData[index].key === "meedu.addons.TencentCloudHls.region"
            ) {
              form.setFieldsValue({
                "meedu.addons.TencentCloudHls.region":
                  configTenData[index].value,
              });
            } else if (
              configTenData[index].key ===
              "meedu.addons.TencentCloudHls.transcode_definition"
            ) {
              if (
                configTenData[index].value &&
                configTenData[index].value.length > 0
              ) {
                form.setFieldsValue({
                  "meedu.addons.TencentCloudHls.transcode_definition":
                    configTenData[index].value.split(","),
                });
              }
            }
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
    if (values["meedu.addons.TencentCloudHls.transcode_definition"]) {
      values["meedu.addons.TencentCloudHls.transcode_definition"] =
        values["meedu.addons.TencentCloudHls.transcode_definition"].join(",");
    }
    values["meedu.addons.AliyunHls.kms_region"] =
      values["meedu.addons.AliyunHls.region"];
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="视频加密"></BackBartment>
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
            name="system-videoHls-config"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {enabledAddons["AliyunHls"] === 1 && (
              <>
                <div className="from-title mt-30">阿里云HLS加密</div>
                <Form.Item
                  label="视频转码模板ID"
                  name="meedu.addons.AliyunHls.template_id"
                >
                  <Form.Item name="meedu.addons.AliyunHls.template_id">
                    <Input style={{ width: 300 }} allowClear />
                  </Form.Item>
                  <div className="form-helper-text">
                    <span>
                      配置教程地址：https://www.yuque.com/meedu/fvvkbf/xdqeeb
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="AccessKeyId"
                  name="meedu.addons.AliyunHls.access_key"
                >
                  <Input style={{ width: 300 }} allowClear />
                </Form.Item>
                <Form.Item
                  label="AccessKeySecret"
                  name="meedu.addons.AliyunHls.access_secret"
                >
                  <Input style={{ width: 300 }} allowClear />
                </Form.Item>
              </>
            )}
            {enabledAddons["TencentCloudHls"] === 1 && (
              <>
                <div className="from-title mt-30">腾讯云HLS加密</div>
                <Form.Item
                  label="腾讯云视频存储region"
                  name="meedu.addons.TencentCloudHls.region"
                >
                  <Form.Item name="meedu.addons.TencentCloudHls.region">
                    <Select
                      style={{ width: 300 }}
                      allowClear
                      options={regions}
                    />
                  </Form.Item>
                  <div className="form-helper-text">
                    <span>
                      配置教程：https://www.yuque.com/meedu/ww4uyo/umxey1
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="清晰度(多个请用英文逗号连接)"
                  name="meedu.addons.TencentCloudHls.transcode_definition"
                >
                  <Select
                    mode="multiple"
                    style={{ width: 300 }}
                    allowClear
                    options={definition}
                    placeholder="请选择"
                  />
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

export default SystemvVideoHlsConfigPage;
