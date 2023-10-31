import { useEffect, useState } from "react";
import { Switch, Modal, Form, Select, Input, message } from "antd";
import { order } from "../../../../api/index";

interface PropsInterface {
  open: boolean;
  ids: any[];
  onCancel: () => void;
  onSuccess: () => void;
}

export const WithdrawDialog = (props: PropsInterface) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [v_type, setVtype] = useState(0);
  const types = [
    {
      label: "成功",
      value: 5,
    },
    {
      label: "驳回",
      value: 3,
    },
  ];
  const actionList = [
    {
      label: "走提现渠道",
      value: "follow",
    },
    {
      label: "线下手动打款",
      value: "hand",
    },
  ];

  useEffect(() => {
    if (props.open) {
      setVtype(0);
      form.setFieldsValue({
        status: [],
        remark: "",
        is_return: 1,
      });
    }
  }, [props.open]);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values.id = props.ids[0];
    order
      .withdrawOrdersSubmit(values)
      .then(() => {
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

  const onSwitch = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_return: 1 });
    } else {
      form.setFieldsValue({ is_return: 0 });
    }
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="提现处理"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={500}
          maskClosable={false}
          onOk={() => {
            form.submit();
          }}
          centered
        >
          <div className="float-left mt-30">
            <Form
              form={form}
              name="refund-dailog"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="打款方式"
                name="action"
                rules={[{ required: true, message: "请选择打款方式!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择打款方式"
                  options={actionList}
                />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: "请选择状态!" }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择状态"
                  options={types}
                  onChange={(e) => {
                    setVtype(e);
                  }}
                />
              </Form.Item>
              <div style={{ display: v_type === 3 ? "block" : "none" }}>
                <Form.Item
                  label="是否退回提现金额"
                  name="is_return"
                  valuePropName="checked"
                  rules={[
                    { required: true, message: "请选择是否退回提现金额!" },
                  ]}
                >
                  <Switch onChange={onSwitch} />
                </Form.Item>
              </div>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: true, message: "请输入备注!" }]}
              >
                <Input.TextArea
                  style={{ width: 300 }}
                  placeholder="请输入备注"
                  allowClear
                  rows={3}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
