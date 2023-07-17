import { useState, useEffect } from "react";
import { message, DatePicker, Form, Button, Input, Space, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { live } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, HelperText, PerButton } from "../../../components";
import moment from "moment";

const LiveVideoCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState(Number(result.get("course_id")));

  useEffect(() => {
    document.title = "新建直播排课";
    dispatch(titleAction("新建直播排课"));
    getParams();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("course_id")));
  }, [result.get("course_id")]);

  const getParams = () => {
    live.videoCreate().then((res: any) => {
      var data = res.data.chapters[id];
      if (data && data.length > 0) {
        let arr: any = [];
        for (var i = 0; i < data.length; i++) {
          arr.push({
            label: data[i].name,
            value: data[i].id,
          });
        }
        setChapters(arr);
      }
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.published_at = moment(new Date(values.published_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    values.course_id = id;
    values.estimate_duration = values.estimate_duration * 60;
    values.is_show = 1;
    live
      .videoStore(values)
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建直播排课" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="live-video-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="章节" name="chapter_id">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="chapter_id">
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择章节"
                  options={chapters}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="章节管理"
                  class="c-primary"
                  icon={null}
                  p="addons.Zhibo.course_chapter.list"
                  onClick={() => {
                    navigate("/live/course/chapter/index?id=" + id);
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="直播标题"
            name="title"
            rules={[{ required: true, message: "请输入直播标题!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入直播标题"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="直播时间"
            name="published_at"
            rules={[{ required: true, message: "请选择直播时间!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              style={{ width: 300 }}
              showTime
              placeholder="请选择到期时间"
            />
          </Form.Item>

          <Form.Item
            label="预估直播时长"
            name="estimate_duration"
            rules={[{ required: true, message: "请输入预估直播时长!" }]}
          >
            <Space align="center">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="estimate_duration"
                rules={[{ required: true, message: "请输入预估直播时长!" }]}
              >
                <Input
                  type="number"
                  addonAfter="分钟"
                  style={{ width: 300 }}
                  placeholder="请输入预估直播时长"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="学员观看直播超过此时长即代表学完此课时"></HelperText>
              </div>
            </Space>
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
export default LiveVideoCreatePage;
