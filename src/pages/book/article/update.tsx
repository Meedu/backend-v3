import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Form,
  DatePicker,
  Switch,
  Space,
  Select,
  Spin,
} from "antd";
import { useDispatch } from "react-redux";
import { book } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import {
  BackBartment,
  PerButton,
  HelperText,
  QuillEditor,
  MdEditor,
} from "../../../components";
import dayjs from "dayjs";
import moment from "moment";

const BookArticleUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [charge, setCharge] = useState(0);
  const [defautValue, setDefautValue] = useState("");
  const [editor, setEditor] = useState("");
  const [renderValue, setRenderValue] = useState("");
  const [id, setId] = useState(Number(result.get("id")));
  const [bid, setBid] = useState(Number(result.get("bid")));

  useEffect(() => {
    document.title = "编辑电子书文章";
    dispatch(titleAction("编辑电子书文章"));
    initData();
  }, [id, bid]);

  useEffect(() => {
    setId(Number(result.get("id")));
    setBid(Number(result.get("bid")));
    getDetail();
  }, [result.get("id"), result.get("bid")]);

  const initData = async () => {
    await getBook();
    await getParams();
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await book.articleDetail(id);
    var data = res.data;
    form.setFieldsValue({
      book_cid: data.book_cid == 0 ? [] : data.book_cid,
      title: data.title,
      is_show: data.is_show,
      trySee: data.charge === 0 ? 1 : 0,
      original_content: data.original_content,
      charge: data.charge,
      published_at: dayjs(data.published_at, "YYYY-MM-DD HH:mm"),
    });
    setEditor(data.editor);
    setDefautValue(data.original_content);
    setRenderValue(data.render_content);
  };

  const getParams = async () => {
    const res: any = await book.articleCreate({});
    let categories = res.data.chapters[bid];
    if (categories) {
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
    }
  };

  const getBook = async () => {
    const res: any = await book.detail(bid);
    setCharge(res.data.charge);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    values.editor = editor;
    if (editor === "MARKDOWN") {
      values.render_content = renderValue;
    } else {
      values.render_content = values.original_content;
    }
    values.bid = bid;
    values.published_at = moment(new Date(values.published_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    setLoading(true);
    book
      .articleUpdate(id, values)
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
      form.setFieldsValue({ trySee: 1 });
    } else {
      form.setFieldsValue({ trySee: 0 });
    }
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑电子书文章" />
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
          name="book-article-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="book_cid" label="章节">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="book_cid">
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择章节"
                  options={categories}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="章节管理"
                  class="c-primary"
                  icon={null}
                  p="addons.meedu_books.book_chapter.list"
                  onClick={() => {
                    navigate("/meedubook/chapter/index?bid=" + bid);
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题!" }]}
          >
            <Input style={{ width: 300 }} placeholder="请输入标题" allowClear />
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
          {charge > 0 && (
            <Form.Item label="试看" name="trySee">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="trySee" valuePropName="checked">
                  <Switch onChange={isVipChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="开启试看的话未购买电子书学员可直接浏览该篇文章。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          <Form.Item label="显示文章" name="is_show">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="is_show" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="关闭后电子书文章在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="文章内容"
            name="original_content"
            rules={[{ required: true, message: "请输入文章内容!" }]}
            style={{ height: 840 }}
          >
            <div className="w-800px">
              {editor === "MARKDOWN" ? (
                <MdEditor
                  height={800}
                  defautValue={defautValue}
                  setContent={(value: string, renderValue: string) => {
                    form.setFieldsValue({ original_content: value });
                    setRenderValue(renderValue);
                  }}
                ></MdEditor>
              ) : (
                <QuillEditor
                  mode=""
                  height={800}
                  defautValue={defautValue}
                  isFormula={false}
                  setContent={(value: string) => {
                    form.setFieldsValue({ original_content: value });
                  }}
                ></QuillEditor>
              )}
            </div>
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

export default BookArticleUpdatePage;
