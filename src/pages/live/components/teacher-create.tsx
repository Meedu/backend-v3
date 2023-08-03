import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Select, Space, Row, Col } from "antd";
import { live } from "../../../api/index";
import { HelperText, UploadImageButton } from "../../../components";

interface PropsInterface {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CourseTeacherCreateDialog = (props: PropsInterface) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<any>([]);
  const [roleName, setRoleName] = useState<string>("讲师");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (props.open) {
      form.setFieldsValue({
        role_id: [],
        name: "",
        avatar: "",
        username: "",
        password: "",
        short_desc: "",
      });
      setAvatar("");
      setRoleName("讲师");
    }
    getParams();
  }, [props.open]);

  const getParams = () => {
    live.teacherCreate().then((res: any) => {
      let box: any = [];
      for (let i = 0; i < res.data.roles.length; i++) {
        box.push({
          label: res.data.roles[i].name,
          value: res.data.roles[i].id,
        });
      }
      setRoles(box);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .teacherStore(values)
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        props.onSuccess();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="添加讲师/助教"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={800}
          maskClosable={false}
          onOk={() => {
            form.submit();
          }}
          centered
        >
          <div className="float-left mt-30">
            <Form
              form={form}
              name="live-teacher-create-dailog"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="角色"
                name="role_id"
                rules={[{ required: true, message: "请选择角色!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  placeholder="请选择角色"
                  allowClear
                  options={roles}
                  onChange={(e) => {
                    if (e === 0) {
                      setRoleName("讲师");
                    } else {
                      setRoleName("助教");
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={roleName + "名称"}
                name="name"
                rules={[
                  { required: true, message: "请输入" + roleName + "名称!" },
                ]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder={"请输入" + roleName + "名称"}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label={roleName + "头像"}
                name="avatar"
                rules={[{ required: true, message: "填输入排序!" }]}
              >
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item
                    name="avatar"
                    rules={[{ required: true, message: "填输入排序!" }]}
                  >
                    <UploadImageButton
                      text={roleName + "头像"}
                      onSelected={(url) => {
                        form.setFieldsValue({ avatar: url });
                        setAvatar(url);
                      }}
                    ></UploadImageButton>
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="长宽比1:1 推荐尺寸200x200"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              {avatar && (
                <Row style={{ marginBottom: 22 }}>
                  <Col span={3}></Col>
                  <Col span={21}>
                    <div
                      className="normal-thumb-box"
                      style={{
                        backgroundImage: `url(${avatar})`,
                        width: 100,
                        height: 100,
                      }}
                    ></div>
                  </Col>
                </Row>
              )}
              <Form.Item
                label="登录邮箱"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "填输入" + roleName + "登录邮箱!",
                  },
                ]}
              >
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "填输入" + roleName + "登录邮箱!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: 300 }}
                      placeholder={"填输入" + roleName + "登录邮箱"}
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="用于讲师/助教客户端登录"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              <Form.Item
                label="登录密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "填输入" + roleName + "登录密码!",
                  },
                ]}
              >
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "填输入" + roleName + "登录密码!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: 300 }}
                      placeholder={"填输入" + roleName + "登录密码"}
                      allowClear
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="用于讲师/助教客户端登录"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              {roleName === "讲师" && (
                <Form.Item
                  label="讲师风采"
                  name="short_desc"
                  rules={[
                    {
                      required: true,
                      message: "填输入讲师风采!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    style={{ width: 600, resize: "none" }}
                    placeholder="填写讲师/助教相关介绍，用于直播课前台展示"
                    allowClear
                  />
                </Form.Item>
              )}
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
