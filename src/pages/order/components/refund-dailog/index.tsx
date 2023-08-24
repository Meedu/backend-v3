import { useEffect, useState } from "react";
import { Button, Row, Col, Modal, Form, Select, Input, message } from "antd";
import { HelperText } from "../../../../components";
import { order } from "../../../../api/index";

interface PropsInterface {
  open: boolean;
  id: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export const RefundDialog = (props: PropsInterface) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const types = [
    {
      label: "原渠道退回",
      value: 0,
    },
    {
      label: "线下退款（线上记录）",
      value: 1,
    },
  ];

  useEffect(() => {
    if (props.open) {
      form.setFieldsValue({
        amount: "",
        is_local: [],
        reason: "",
      });
    }
  }, [props.open]);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    values.amount = Number(values.amount) * 100;
    setLoading(true);
    order
      .refund(props.id, values)
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        props.onSuccess();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      {props.open ? (
        <Modal
          title="退款"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={430}
          maskClosable={false}
          onOk={() => {
            form.submit();
          }}
          centered
        >
          <div className="float-left mb-30 mt-30">
            <HelperText text="退款成功不会自动取消课程/会员绑定关系，需手动操作。"></HelperText>
          </div>
          <div className="float-left">
            <Form
              form={form}
              name="refund-dailog"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="退款方式"
                name="is_local"
                rules={[{ required: true, message: "请选择退款方式!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择退款方式"
                  options={types}
                />
              </Form.Item>

              <Form.Item
                label="退款金额"
                name="amount"
                rules={[{ required: true, message: "请输入退款金额!" }]}
              >
                <Input
                  type="number"
                  addonAfter="元"
                  style={{ width: 300 }}
                  placeholder="请输入退款金额"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="退款理由"
                name="reason"
                rules={[{ required: true, message: "请输入退款理由!" }]}
              >
                <Input.TextArea
                  style={{ width: 300 }}
                  placeholder="请输入退款理由"
                  allowClear
                  rows={4}
                  maxLength={64}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
