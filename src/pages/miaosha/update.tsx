import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Form, Space, DatePicker, Spin } from "antd";
import { useDispatch } from "react-redux";
import { miaosha } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { HelperText, BackBartment } from "../../components";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import moment from "moment";

const MiaoshaUpdatePage = () => {
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
  const [num, setNum] = useState(0);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "编辑秒杀活动";
    dispatch(titleAction("编辑秒杀活动"));
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
    const res: any = await miaosha.detail(id);
    var data = res.data;
    let arr: any = [
      dayjs(data.started_at, "YYYY-MM-DD HH:mm"),
      dayjs(data.end_at, "YYYY-MM-DD HH:mm"),
    ];
    form.setFieldsValue({
      charge: data.charge,
      started_at: arr,
    });
    setThumb(data.goods_thumb);
    setOriginalCharge(data.original_charge);
    setTitle(data.goods_title);
    setGoodsId(data.goods_id);
    setGoodsType(data.goods_type);
    setNum(data.num);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (values.charge < 0) {
      message.error("请输入正确的秒杀价");
      return;
    }
    if (values.num < 0) {
      message.error("请输入正确的库存");
      return;
    }
    setLoading(true);
    values.goods_id = goods_id;
    values.goods_type = goods_type;
    values.num = num;
    values.original_charge = original_charge;
    values.goods_title = title;
    values.goods_thumb = thumb;
    values.end_at = moment(new Date(values.started_at[1])).format(
      "YYYY-MM-DD HH:mm"
    );
    values.started_at = moment(new Date(values.started_at[0])).format(
      "YYYY-MM-DD HH:mm"
    );
    miaosha
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
      <BackBartment title="编辑秒杀活动" />
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
          name="miaosha-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="秒杀价"
            name="charge"
            rules={[{ required: true, message: "请输入秒杀价!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="charge"
                rules={[{ required: true, message: "请输入秒杀价!" }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入秒杀价"
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
            label="活动时间"
            name="started_at"
            rules={[{ required: true, message: "请输入活动时间!" }]}
          >
            <RangePicker
              format={"YYYY-MM-DD HH:mm"}
              showTime
              placeholder={["开始时间", "结束时间"]}
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

export default MiaoshaUpdatePage;
