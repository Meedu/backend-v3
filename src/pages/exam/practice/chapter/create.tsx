import { useEffect, useState } from "react";
import { Form, Input, message, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { practice } from "../../../../api/index";
import { titleAction } from "../../../../store/user/loginUserSlice";
import { BackBartment, HelperText } from "../../../../components";

const PracticeChapterCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState(Number(result.get("pid")));

  useEffect(() => {
    document.title = "添加练习章节";
    dispatch(titleAction("添加练习章节"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("pid")));
  }, [result.get("pid")]);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.pid = id;
    practice
      .chaptersStore(values)
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
      <BackBartment title="添加练习章节" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="practice-chapter-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="章节名"
            name="name"
            rules={[{ required: true, message: "请输入章节名!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入章节名"
              allowClear
            />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="sort">
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入排序"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。小数排在前，大数排在后。"></HelperText>
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

export default PracticeChapterCreatePage;
