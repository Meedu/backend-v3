import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Form, Space, DatePicker, Spin } from "antd";
import { useDispatch } from "react-redux";
import { tuangou } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { HelperText, BackBartment } from "../../components";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import moment from "moment";

const TuangouUpdatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [goods_type, setGoodsType] = useState<string>("");
  const [original_charge, setOriginalCharge] = useState("");
  const [goods_id, setGoodsId] = useState(0);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑团购活动";
    dispatch(titleAction("编辑团购活动"));
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
    const res: any = await tuangou.detail(id);
    var data = res.data.data;
    let arr: any = [
      dayjs(data.started_at, "YYYY-MM-DD HH:mm"),
      dayjs(data.ended_at, "YYYY-MM-DD HH:mm"),
    ];
    form.setFieldsValue({
      charge: data.charge,
      started_at: arr,
      people_num: data.people_num,
      time_limit: data.time_limit,
    });
    setThumb(data.goods_thumb);
    setOriginalCharge(data.original_charge);
    setTitle(data.goods_title);
    setGoodsId(data.other_id);
    setGoodsType(data.goods_type);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.charge < 0) {
      message.error("请输入正确的团购价");
      return;
    }
    if (values.people_num < 2) {
      message.error("组团成功人数最少为2个");
      return;
    }
    if (values.time_limit < 0) {
      message.error("请输入正确的有效期");
      return;
    }
    setLoading(true);
    values.goods_type = goods_type;
    values.original_charge = original_charge;
    values.goods_title = title;
    values.goods_thumb = thumb;
    values.other_id = goods_id;
    values.ended_at = moment(new Date(values.started_at[1])).format(
      "YYYY-MM-DD HH:mm"
    );
    values.started_at = moment(new Date(values.started_at[0])).format(
      "YYYY-MM-DD HH:mm"
    );
    tuangou
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
      <BackBartment title="编辑团购活动" />
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
          name="tuangou-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="团购价"
            name="charge"
            rules={[{ required: true, message: "请输入团购价!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="charge"
                rules={[{ required: true, message: "请输入团购价!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入团购价"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="最小单位：元。不支持小数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="组团成功人数"
            name="people_num"
            rules={[{ required: true, message: "请输入组团成功人数!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="people_num"
                rules={[{ required: true, message: "请输入组团成功人数!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入组团成功人数"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="组团达到指定人数即为组团成功。原则上最少为2个人。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="有效期"
            name="time_limit"
            rules={[{ required: true, message: "请输入有效期!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="time_limit"
                rules={[{ required: true, message: "请输入有效期!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="单位：天"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="团长开团时刻起多少天内有效，失败的话将自动转为退款订单"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="活动时间" required={true}>
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="started_at"
                rules={[{ required: true, message: "请输入活动时间!" }]}
              >
                <RangePicker
                  format={"YYYY-MM-DD HH:mm"}
                  showTime
                  placeholder={["开始时间", "结束时间"]}
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="团购开始时间，时间达到之后，学员才能参与团购"></HelperText>
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

export default TuangouUpdatePage;
