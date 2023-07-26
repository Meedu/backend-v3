import { useEffect, useState } from "react";
import {
  Form,
  Input,
  message,
  Button,
  Select,
  Space,
  Switch,
  DatePicker,
  Row,
  Col,
  Spin,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { path } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  HelperText,
  BackBartment,
  UploadImageButton,
  PerButton,
} from "../../components";
import dayjs from "dayjs";
import moment from "moment";

const LearnPathUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑学习路径";
    dispatch(titleAction("编辑学习路径"));
    initData();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("id")));
    getDetail();
  }, [result.get("id")]);

  const initData = async () => {
    await getParams();
    await getDetail();
    setInit(false);
  };

  const getParams = async () => {
    const res: any = await path.create();
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
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await path.detail(id);
    var data = res.data;
    form.setFieldsValue({
      category_id: data.category_id,
      name: data.name,
      thumb: data.thumb,
      is_show: data.is_show,
      desc: data.desc,
      original_charge: data.original_charge,
      charge: data.charge,
      published_at: dayjs(data.published_at, "YYYY-MM-DD HH:mm"),
    });
    setThumb(data.thumb);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.published_at = moment(new Date(values.published_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    path
      .update(id, values)
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑学习路径" />
      {init && (
        <div className="float-left text-center mt-30">
          <Spin></Spin>
        </div>
      )}
      <div
        style={{ display: init ? "none" : "block" }}
        className="float-left mt-30"
      >
        <Form
          form={form}
          name="learnPath-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
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
              <PerButton
                type="link"
                text="分类管理"
                class="c-primary"
                icon={null}
                p="addons.learnPaths.category.list"
                onClick={() => {
                  navigate("/learningpath/path/category/index");
                }}
                disabled={null}
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="路径名称"
            name="name"
            rules={[{ required: true, message: "请输入路径名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入路径名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="路径封面"
            name="thumb"
            rules={[{ required: true, message: "请上传路径封面!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="thumb"
                rules={[{ required: true, message: "请上传路径封面!" }]}
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
                <HelperText text="长宽比4:3，建议尺寸：400x300像素"></HelperText>
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
          <Form.Item
            label="原价"
            name="original_charge"
            rules={[{ required: true, message: "请输入原价!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="单位：元"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="现价"
            name="charge"
            rules={[{ required: true, message: "请输入现价!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="单位：元"
              allowClear
            />
          </Form.Item>
          <Form.Item label="上架时间" required={true}>
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
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
                <HelperText text="关闭后此路径在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="简短介绍"
            name="desc"
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
        </Form>
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
    </div>
  );
};

export default LearnPathUpdatePage;
