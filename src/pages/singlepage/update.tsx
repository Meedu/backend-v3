import { useEffect, useState } from "react";
import { Form, message, Button, Space, Input, Switch } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, HelperText, QuillEditor } from "../../components";
import { singlepage } from "../../api/index";

const SingleUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [richText, setRichText] = useState<boolean>(true);
  const [defautValue, setDefautValue] = useState("");
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑单页面";
    dispatch(titleAction("编辑单页面"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    getDetail();
  }, [result.get("id")]);

  const getDetail = () => {
    if (id === 0) {
      return;
    }
    singlepage.detail(id).then((res: any) => {
      var data = res.data;
      form.setFieldsValue({
        title: data.title,
        content: data.content,
        sign: data.sign,
        is_inherit: data.is_inherit,
        seo_description: data.seo_description,
        seo_keywords: data.seo_keywords,
      });
      setDefautValue(data.content);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    singlepage
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
      form.setFieldsValue({ is_inherit: 1 });
    } else {
      form.setFieldsValue({ is_inherit: 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑单页面" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="singlepage-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="页面标识"
            name="sign"
            rules={[{ required: true, message: "请输入页面标识!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="sign"
                rules={[{ required: true, message: "请输入页面标识!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入页面标识"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请填写英文字母+数字组合的一串字符串"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="title"
                rules={[{ required: true, message: "请输入标题!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入标题"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="指定该页面在浏览器标签栏显示的标题"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="继承布局" name="is_inherit">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_inherit" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="是否继承网站已有的布局（头部+导航栏+底部）"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {richText && (
            <Form.Item
              label="页面内容"
              name="content"
              rules={[{ required: true, message: "请输入页面内容!" }]}
            >
              <div className="c-flex w-800px">
                <div
                  className="changeContent "
                  onClick={() => setRichText(!richText)}
                >
                  纯文本
                </div>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "请输入页面内容!" }]}
                >
                  <QuillEditor
                    mode=""
                    height={400}
                    defautValue={defautValue}
                    isFormula={false}
                    setContent={(value: string) => {
                      form.setFieldsValue({ content: value });
                    }}
                  ></QuillEditor>
                </Form.Item>
              </div>
            </Form.Item>
          )}
          {!richText && (
            <Form.Item
              label="页面内容"
              name="content"
              rules={[{ required: true, message: "请输入页面内容!" }]}
            >
              <div className="c-flex">
                <div
                  className="changeContent "
                  onClick={() => setRichText(!richText)}
                >
                  富文本
                </div>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "请输入页面内容!" }]}
                >
                  <Input.TextArea
                    style={{ width: 800 }}
                    placeholder="请填写页面内容"
                    allowClear
                    rows={4}
                  />
                </Form.Item>
              </div>
            </Form.Item>
          )}
          <Form.Item label="Seo关键字" name="seo_keywords">
            <Input.TextArea
              style={{ width: 400 }}
              placeholder="请填写Seo关键字"
              allowClear
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Seo描述" name="seo_description">
            <Input.TextArea
              style={{ width: 400 }}
              placeholder="请填写Seo描述"
              allowClear
              rows={4}
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

export default SingleUpdatePage;
