import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Form, Space, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { miaosha } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { HelperText, BackBartment, SelectResources } from "../../components";
const { RangePicker } = DatePicker;
import moment from "moment";

const MiaoshaCreatePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [goods_type, setGoodsType] = useState<string>("");
  const [original_charge, setOriginalCharge] = useState("");
  const [showSelectResWin, setShowSelectResWin] = useState<boolean>(false);

  useEffect(() => {
    document.title = "新建秒杀活动";
    dispatch(titleAction("新建秒杀活动"));
  }, []);

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
    values.goods_type = goods_type;
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建秒杀活动" />
      <SelectResources
        open={showSelectResWin}
        enabledResource={"vod,live,book,learnPath"}
        onCancel={() => setShowSelectResWin(false)}
        onSelected={(result: any) => {
          form.setFieldsValue({
            goods_id: result.id,
          });
          setTitle(result.title);
          setThumb(result.thumb);
          if (result.resource_type === "vod") {
            setGoodsType("course");
          } else {
            setGoodsType(result.resource_type);
          }
          setOriginalCharge(result.original_charge);
          setShowSelectResWin(false);
        }}
      ></SelectResources>
      <div className="float-left mt-30">
        <Form
          form={form}
          name="miaosha-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="商品"
            name="goods_id"
            rules={[{ required: true, message: "请选择商品!" }]}
          >
            <Button
              loading={loading}
              type="primary"
              onClick={() => setShowSelectResWin(true)}
            >
              {title && <span>已选择「{title}」</span>}
              {!title && <span>选择商品</span>}
            </Button>
          </Form.Item>
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
            label="库存"
            name="num"
            rules={[{ required: true, message: "请输入库存!" }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="请输入库存"
              allowClear
            />
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

export default MiaoshaCreatePage;
