import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, DatePicker, Form, Spin } from "antd";
import { useDispatch } from "react-redux";
import { codeExchanger } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";
import moment from "moment";
import dayjs from "dayjs";

const CodeExchangerUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [relate_data, setRelateData] = useState("");

  useEffect(() => {
    document.title = "编辑兑换活动";
    dispatch(titleAction("编辑兑换活动"));
    initData();
  }, [id]);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  const initData = async () => {
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await codeExchanger.detail(id);
    var data = res.data;
    setRelateData(data.relate_data);
    form.setFieldsValue({
      name: data.name,
      start_at: dayjs(data.start_at, "YYYY-MM-DD HH:mm"),
      end_at: dayjs(data.end_at, "YYYY-MM-DD HH:mm"),
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.relate_data = relate_data;
    values.start_at = moment(new Date(values.start_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    values.end_at = moment(new Date(values.end_at)).format("YYYY-MM-DD HH:mm");
    codeExchanger
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑兑换活动" />
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
          name="codeExchanger-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: "请输入活动名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入活动名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="活动开始时间"
            name="start_at"
            rules={[{ required: true, message: "请选择开始时间!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              style={{ width: 300 }}
              showTime
              placeholder="请选择开始时间"
            />
          </Form.Item>
          <Form.Item
            label="活动结束时间"
            name="end_at"
            rules={[{ required: true, message: "请选择结束时间!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              style={{ width: 300 }}
              showTime
              placeholder="请选择结束时间"
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

export default CodeExchangerUpdatePage;
