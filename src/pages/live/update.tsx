import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Form,
  Tabs,
  Switch,
  Space,
  Select,
  Row,
  Col,
  DatePicker,
  Spin,
} from "antd";
import { useDispatch } from "react-redux";
import { live } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  BackBartment,
  UploadImageButton,
  HelperText,
  QuillEditor,
  PerButton,
} from "../../components";
import dayjs from "dayjs";
import moment from "moment";

const LiveUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [resourceActive, setResourceActive] = useState<string>("base");
  const [categories, setCategories] = useState<any>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [assistants, setAssistants] = useState<any>([]);
  const [isFree, setIsFree] = useState(0);
  const [thumb, setThumb] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [defautValue, setDefautValue] = useState("");
  const [original_charge, setOriginalCharge] = useState(0);
  const [original_vip_can_view, setOriginalVipCanView] = useState(0);
  const [id, setId] = useState(Number(result.get("id")));
  const types = [
    {
      key: "base",
      label: "基础信息",
    },
    {
      key: "dev",
      label: "可选信息",
    },
  ];

  useEffect(() => {
    document.title = "编辑直播课程";
    dispatch(titleAction("编辑直播课程"));
    initData();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  const initData = async () => {
    await getParams();
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await live.detail(id);
    var data = res.data;
    form.setFieldsValue({
      category_id: data.category_id,
      title: data.title,
      thumb: data.thumb,
      is_show: data.is_show,
      assistant_id: data.assistant_id === 0 ? [] : data.assistant_id,
      teacher_id: data.teacher_id,
      vip_can_view: data.vip_can_view,
      short_description: data.short_description,
      original_desc: data.original_desc,
      charge: data.charge,
      poster: data.poster,
      published_at: dayjs(data.published_at, "YYYY-MM-DD HH:mm"),
    });
    if (data.charge > 0) {
      setIsFree(0);
    } else {
      setIsFree(1);
    }
    setOriginalCharge(data.charge);
    setOriginalVipCanView(data.vip_can_view);
    setDefautValue(data.original_desc);
    setThumb(data.thumb);
    setPoster(data.poster);
  };

  const getParams = async () => {
    const res: any = await live.create();
    let categories = res.data.categories;
    const box: any = [];
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].children.length > 0) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
        let children = categories[i].children;
        for (let j = 0; j < children.length; j++) {
          children[j].name = "|----" + children[j].name;
          box.push({
            label: children[j].name,
            value: children[j].id,
          });
        }
      } else {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
    }
    setCategories(box);
    let assistants = res.data.teachers.assistant;
    const box2: any = [];
    for (let i = 0; i < assistants.length; i++) {
      box2.push({
        label: assistants[i].name,
        value: assistants[i].id,
      });
    }
    setAssistants(box2);
    let teachers = res.data.teachers.teacher;
    const box3: any = [];
    for (let i = 0; i < teachers.length; i++) {
      box3.push({
        label: teachers[i].name,
        value: teachers[i].id,
      });
    }
    setTeachers(box3);
  };

  const onChange = (key: string) => {
    setResourceActive(key);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.charge == 0) {
      values.vip_can_view = 0;
    }
    values.render_desc = values.original_desc;
    values.published_at = moment(new Date(values.published_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    setLoading(true);
    live
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

  const isFreeChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ charge: 0, vip_can_view: 0 });
      setIsFree(1);
    } else {
      form.setFieldsValue({
        charge: original_charge,
        vip_can_view: original_vip_can_view,
      });
      setIsFree(0);
    }
  };

  const onSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_show: 1 });
    } else {
      form.setFieldsValue({ is_show: 0 });
    }
  };

  const onVipChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ vip_can_view: 1 });
    } else {
      form.setFieldsValue({ vip_can_view: 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑直播课程" />
      <div className="center-tabs mb-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
      </div>
      {init && (
        <div className="float-left text-center">
          <Spin></Spin>
        </div>
      )}
      <div style={{ display: init ? "none" : "block" }} className="float-left">
        <Form
          form={form}
          name="live-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div
            style={{ display: resourceActive === "base" ? "block" : "none" }}
          >
            <Form.Item
              label="所属分类"
              name="category_id"
              rules={[{ required: true, message: "请选择所属分类!" }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="category_id"
                  rules={[{ required: true, message: "请选择所属分类!" }]}
                >
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择所属分类"
                    options={categories}
                  />
                </Form.Item>
                <div>
                  <PerButton
                    type="link"
                    text="分类管理"
                    class="c-primary"
                    icon={null}
                    p="addons.Zhibo.course_category.list"
                    onClick={() => {
                      navigate("/live/course/category/index");
                    }}
                    disabled={null}
                  />
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              label="讲师"
              name="teacher_id"
              rules={[{ required: true, message: "请选择讲师!" }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="teacher_id"
                  rules={[{ required: true, message: "请选择讲师!" }]}
                >
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择讲师"
                    options={teachers}
                  />
                </Form.Item>
                <div>
                  <PerButton
                    type="link"
                    text="讲师管理"
                    class="c-primary"
                    icon={null}
                    p="addons.Zhibo.teacher.list"
                    onClick={() => {
                      navigate("/live/teacher/index");
                    }}
                    disabled={null}
                  />
                </div>
              </Space>
            </Form.Item>
            <Form.Item label="助教" name="assistant_id">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="assistant_id">
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择助教"
                    options={assistants}
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="可选择助教辅助讲师直播"></HelperText>
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              label="课程名"
              name="title"
              rules={[{ required: true, message: "请输入课程名!" }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="请输入课程名"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="课程封面"
              name="thumb"
              rules={[{ required: true, message: "请上传课程封面!" }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="thumb"
                  rules={[{ required: true, message: "请上传课程封面!" }]}
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
                  <HelperText text="推荐尺寸400x300 宽高比4:3"></HelperText>
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
            <Form.Item label="免费" valuePropName="checked" key={isFree}>
              <Switch defaultChecked={isFree === 1} onChange={isFreeChange} />
            </Form.Item>
            <div style={{ display: isFree === 0 ? "block" : "none" }}>
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
                      placeholder="请输入价格"
                      allowClear
                      type="number"
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="最小单位“元”，不支持小数"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            </div>
            <Form.Item
              label="上架时间"
              name="published_at"
              rules={[{ required: true, message: "请选择上架时间!" }]}
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm"
                style={{ width: 300 }}
                showTime
                placeholder="请选择上架时间"
              />
            </Form.Item>
            <Form.Item label="显示" name="is_show">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="is_show" valuePropName="checked">
                  <Switch onChange={onSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="关闭后此直播课在前台隐藏显示"></HelperText>
                </div>
              </Space>
            </Form.Item>
            <div style={{ display: isFree === 0 ? "block" : "none" }}>
              <Form.Item label="会员免费" name="vip_can_view">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="vip_can_view" valuePropName="checked">
                    <Switch onChange={onVipChange} />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="如果启用会员免费那么购买VIP会员的学员将可以无需购买直接观看直播。"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            </div>
            <Form.Item
              label="简短介绍"
              name="short_description"
              rules={[{ required: true, message: "请输入简短介绍!" }]}
            >
              <Input.TextArea
                style={{ width: 800 }}
                placeholder="请输入简短介绍"
                allowClear
                rows={4}
                maxLength={150}
                showCount
              />
            </Form.Item>
            <Form.Item
              label="详细介绍"
              name="original_desc"
              rules={[{ required: true, message: "请输入详细介绍!" }]}
              style={{ height: 440 }}
            >
              <div className="w-800px">
                <QuillEditor
                  mode=""
                  height={400}
                  defautValue={defautValue}
                  isFormula={false}
                  setContent={(value: string) => {
                    form.setFieldsValue({ original_desc: value });
                  }}
                ></QuillEditor>
              </div>
            </Form.Item>
          </div>
          <div style={{ display: resourceActive === "dev" ? "block" : "none" }}>
            <Form.Item label="播放封面" name="poster">
              <Space align="baseline" style={{ height: 32 }}>
                <UploadImageButton
                  text="上传播放封面"
                  onSelected={(url) => {
                    form.setFieldsValue({ poster: url });
                    setPoster(url);
                  }}
                ></UploadImageButton>
                <div className="ml-10">
                  {poster && (
                    <Button
                      onClick={() => {
                        form.setFieldsValue({ poster: "" });
                        setPoster("");
                      }}
                    >
                      清空
                    </Button>
                  )}
                </div>
                <div className="ml-10">
                  <HelperText text="播放封面是在进入直播时播放器显示的图片。推荐尺寸：1200x500"></HelperText>
                </div>
              </Space>
            </Form.Item>
            {poster && (
              <Row style={{ marginBottom: 22 }}>
                <Col span={3}></Col>
                <Col span={21}>
                  <div
                    className="normal-thumb-box"
                    style={{
                      backgroundImage: `url(${poster})`,
                      width: 400,
                      height: 166.7,
                    }}
                  ></div>
                </Col>
              </Row>
            )}
          </div>
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

export default LiveUpdatePage;
