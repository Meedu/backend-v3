import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Modal,
  Form,
  DatePicker,
  Switch,
  Row,
  Col,
  Space,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { topic } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  BackBartment,
  PerButton,
  HelperText,
  QuillEditor,
  UploadImageButton,
  MdEditor,
} from "../../components";
import { getEditorKey, saveEditorKey } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
import moment from "moment";

const TopicCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [charge, setCharge] = useState(0);
  const [isFree, setIsFree] = useState(0);
  const [thumb, setThumb] = useState<string>("");
  const [current, setCurrent] = useState("");
  const [editor, setEditor] = useState("");
  const [renderValue, setRenderValue] = useState("");
  const [freeRenderValue, setFreeRenderValue] = useState("");
  const tools = [
    { label: "Markdown", value: "markdown" },
    { label: "富文本编辑器", value: "quill" },
  ];

  useEffect(() => {
    document.title = "新建图文";
    dispatch(titleAction("新建图文"));
    setIsFree(0);
    form.setFieldsValue({
      is_show: 1,
      is_free: 0,
      is_vip_free: false,
    });
    getParams();
  }, []);

  useEffect(() => {
    let localCurrent = getEditorKey();
    if (localCurrent === "markdown") {
      setEditor("MARKDOWN");
    } else {
      setEditor("FULLEDITOR");
    }
    let current = localCurrent ? localCurrent : "quill";
    setCurrent(current);
  }, [getEditorKey()]);

  const getParams = () => {
    topic.create().then((res: any) => {
      let categories = res.data;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }

    if (values.is_free === 1) {
      values.charge = 0;
      values.is_vip_free = false;
      values.free_content = "";
      values.free_content_render = "";
    }

    if (Number(values.charge) % 1 !== 0) {
      message.error("图文价格必须为整数");
      return;
    }

    if (values.is_free === 0 && Number(values.charge) <= 0) {
      message.error("图文价格必须输入且大于0");
      return;
    }
    if (getEditorKey() === "markdown") {
      values.editor = "MARKDOWN";
      values.render_content = renderValue;
      values.free_content_render = freeRenderValue;
    } else {
      values.editor = "FULLEDITOR";
      values.render_content = values.original_content;
      values.free_content_render = values.free_content;
    }
    values.sorted_at = moment(new Date(values.sorted_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    values.is_need_login = 0;
    setLoading(true);
    topic
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

  const onSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_show: 1 });
    } else {
      form.setFieldsValue({ is_show: 0 });
    }
  };

  const isVipChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_vip_free: true });
    } else {
      form.setFieldsValue({ is_vip_free: false });
    }
  };

  const isVChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_free: 1, charge: 0 });
      setIsFree(1);
      setCharge(0);
    } else {
      form.setFieldsValue({ is_free: 0 });
      setIsFree(0);
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建图文" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="topic-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="cid"
            label="所属分类"
            rules={[{ required: true, message: "请选择分类!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="cid"
                rules={[{ required: true, message: "请选择分类!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择分类"
                  options={categories}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="分类管理"
                  class="c-primary"
                  icon={null}
                  p="addons.meedu_topics.category.list"
                  onClick={() => {
                    navigate("/topic/category/index");
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="图文名称"
            name="title"
            rules={[{ required: true, message: "请输入图文名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入图文名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="图文封面"
            name="thumb"
            rules={[{ required: true, message: "请上传图文封面!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="thumb"
                rules={[{ required: true, message: "请上传图文封面!" }]}
              >
                <UploadImageButton
                  text="选择图片"
                  onSelected={(url) => {
                    form.setFieldsValue({ thumb: url });
                    setThumb(url);
                  }}
                ></UploadImageButton>
              </Form.Item>
              <div className="ml-10">
                <HelperText text="建议尺寸400x300 宽高比4:3"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {thumb && (
            <Row style={{ marginBottom: 22 }}>
              <Col span={3}></Col>
              <Col span={21}>
                <div
                  className="normal-thumb-box"
                  style={{
                    backgroundImage: `url(${thumb})`,
                    width: 200,
                    height: 150,
                  }}
                ></div>
              </Col>
            </Row>
          )}
          <Form.Item label="免费" name="is_free" valuePropName="checked">
            <Switch onChange={isVChange} />
          </Form.Item>
          {isFree === 0 && (
            <Form.Item
              label="价格"
              name="charge"
              rules={[{ required: true, message: "请输入价格!" }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="charge"
                  rules={[{ required: true, message: "请输入价格!" }]}
                >
                  <Input
                    style={{ width: 300 }}
                    placeholder="单位：元"
                    allowClear
                    type="number"
                    onChange={(e) => {
                      setCharge(Number(e.target.value));
                    }}
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="请输入整数"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          {charge > 0 && (
            <Form.Item label="会员免费" name="is_vip_free">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="is_vip_free" valuePropName="checked">
                  <Switch onChange={isVipChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="如果开启该选项，则购买VIP会员的学员可以无需购买即可观看该电子书。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          <Form.Item label="上架时间" required={true}>
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="sorted_at"
                rules={[{ required: true, message: "请选择上架时间!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: 300 }}
                  showTime
                  placeholder="请选择上架时间"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="上架时间越晚，排序越靠前"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="显示" name="is_show">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_show" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="关闭后电此图文在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {charge > 0 && (
            <>
              <Form.Item
                label="免费内容"
                name="free_content"
                rules={[{ required: true, message: "请输入付费内容!" }]}
                style={{ height: 840 }}
              >
                <div className="flex flex-row">
                  <div className="w-800px">
                    {editor === "MARKDOWN" ? (
                      <MdEditor
                        height={800}
                        defautValue=""
                        setContent={(value: string, renderValue: string) => {
                          form.setFieldsValue({ free_content: value });
                          setFreeRenderValue(renderValue);
                        }}
                      ></MdEditor>
                    ) : (
                      <QuillEditor
                        mode=""
                        height={800}
                        defautValue=""
                        isFormula={false}
                        setContent={(value: string) => {
                          form.setFieldsValue({ free_content: value });
                        }}
                      ></QuillEditor>
                    )}
                  </div>
                  <div className="ml-30">
                    <Select
                      value={current}
                      style={{ width: 150 }}
                      onChange={(e) => {
                        confirm({
                          title: "警告",
                          icon: <ExclamationCircleFilled />,
                          content: "切换编辑器将清空已编辑文章内容，是否切换？",
                          centered: true,
                          okText: "确认",
                          cancelText: "取消",
                          onOk() {
                            setCurrent(e);
                            saveEditorKey(e);
                          },
                          onCancel() {
                            console.log("Cancel");
                          },
                        });
                      }}
                      placeholder="请选择"
                      options={tools}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label="付费内容"
                name="original_content"
                rules={[{ required: true, message: "请输入付费内容!" }]}
                style={{ height: 840 }}
              >
                <div className="flex flex-row">
                  <div className="w-800px">
                    {editor === "MARKDOWN" ? (
                      <MdEditor
                        height={800}
                        defautValue=""
                        setContent={(value: string, renderValue: string) => {
                          form.setFieldsValue({ original_content: value });
                          setRenderValue(renderValue);
                        }}
                      ></MdEditor>
                    ) : (
                      <QuillEditor
                        mode=""
                        height={800}
                        defautValue=""
                        isFormula={false}
                        setContent={(value: string) => {
                          form.setFieldsValue({ original_content: value });
                        }}
                      ></QuillEditor>
                    )}
                  </div>
                  <div className="ml-30">
                    <Select
                      value={current}
                      style={{ width: 150 }}
                      onChange={(e) => {
                        confirm({
                          title: "警告",
                          icon: <ExclamationCircleFilled />,
                          content: "切换编辑器将清空已编辑文章内容，是否切换？",
                          centered: true,
                          okText: "确认",
                          cancelText: "取消",
                          onOk() {
                            setCurrent(e);
                            saveEditorKey(e);
                          },
                          onCancel() {
                            console.log("Cancel");
                          },
                        });
                      }}
                      placeholder="请选择"
                      options={tools}
                    />
                  </div>
                </div>
              </Form.Item>
            </>
          )}
          {charge === 0 && (
            <Form.Item
              label="文章内容"
              name="original_content"
              rules={[{ required: true, message: "请输入文章内容!" }]}
              style={{ height: 840 }}
            >
              <div className="flex flex-row">
                <div className="w-800px">
                  {editor === "MARKDOWN" ? (
                    <MdEditor
                      height={800}
                      defautValue=""
                      setContent={(value: string, renderValue: string) => {
                        form.setFieldsValue({ original_content: value });
                        setRenderValue(renderValue);
                      }}
                    ></MdEditor>
                  ) : (
                    <QuillEditor
                      mode=""
                      height={800}
                      defautValue=""
                      isFormula={false}
                      setContent={(value: string) => {
                        form.setFieldsValue({ original_content: value });
                      }}
                    ></QuillEditor>
                  )}
                </div>
                <div className="ml-30">
                  <Select
                    value={current}
                    style={{ width: 150 }}
                    onChange={(e) => {
                      confirm({
                        title: "警告",
                        icon: <ExclamationCircleFilled />,
                        content: "切换编辑器将清空已编辑文章内容，是否切换？",
                        centered: true,
                        okText: "确认",
                        cancelText: "取消",
                        onOk() {
                          setCurrent(e);
                          saveEditorKey(e);
                        },
                        onCancel() {
                          console.log("Cancel");
                        },
                      });
                    }}
                    placeholder="请选择"
                    options={tools}
                  />
                </div>
              </div>
            </Form.Item>
          )}
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

export default TopicCreatePage;
