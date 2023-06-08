import { useState, useEffect } from "react";
import { Form, Space, message, Button, Input, Row, Col } from "antd";
import styles from "./create.module.scss";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { certificate } from "../../api/index";
import { PerButton, UploadImageButton } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import foldIcon from "../../assets/images/certificate/icon-fold.png";
import unfoldIcon from "../../assets/images/certificate/icon-unfold.png";
import { LeftOutlined } from "@ant-design/icons";

const CertificateCreatePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadName, setUploadName] = useState<string>("上传背景");
  const [leftArrrow, setLeftArrrow] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string>("");
  const [size, setSize] = useState(0.5);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(106);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {
    document.title = "新建证书";
    dispatch(titleAction("新建证书"));
  }, []);

  useEffect(() => {
    getImgInfo();
    if (thumb) {
      setUploadName("重新上传");
    } else {
      setUploadName("上传背景");
    }
  }, [thumb]);

  const getImgInfo = () => {
    let img = new Image();
    img.src = thumb;
    img.onload = () => {
      setImgHeight(img.height);
      setImgWidth(img.width);
      setOriginalHeight(size * img.height);
      setOriginalWidth(size * img.width);
      console.log("图片原始高度", img.height);
      console.log("图片原始宽度", img.width);
      let valueX = 0.5 * (window.screen.width - size * img.width);
      let valueY = 106;
      setDragX(valueX);
      setDragY(valueY);
    };
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    certificate
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
    <div className={styles["certificate-bg"]}>
      <div className={styles["certificate-content"]}>
        <div className={styles["top-box"]}>
          <div className={styles["btn-back"]} onClick={() => navigate(-1)}>
            <LeftOutlined style={{ marginRight: 4 }} />
            返回
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["name"]}>新建证书</div>
        </div>
        <div
          className={
            leftArrrow ? styles["noleft-arrrow"] : styles["left-arrrow"]
          }
          onClick={() => setLeftArrrow(!leftArrrow)}
        >
          {leftArrrow && <img src={unfoldIcon} width={44} height={44} />}
          {!leftArrrow && <img src={foldIcon} width={44} height={44} />}
        </div>
        <div
          style={{ display: !leftArrrow ? "block" : "none" }}
          className={styles["certificate-blocks-box"]}
        >
          <div className={styles["title"]}>基本信息</div>
          <div className="float-left">
            <Form
              form={form}
              name="certificate-create"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="证书名称"
                name="name"
                rules={[{ required: true, message: "请填写证书名称!" }]}
              >
                <Input
                  style={{ width: 250 }}
                  placeholder="填写证书名称"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="证书背景"
                name="template_image"
                rules={[{ required: true, message: "请上传证书背景!" }]}
              >
                <UploadImageButton
                  text="上传背景"
                  onSelected={(url) => {
                    form.setFieldsValue({ template_image: url });
                    setThumb(url);
                  }}
                ></UploadImageButton>
              </Form.Item>
              {thumb && (
                <Row style={{ marginBottom: 22 }}>
                  <Col span={6}></Col>
                  <Col span={18}>
                    <div className={styles["left-preview-box"]}>
                      <img
                        style={{ maxWidth: 180, width: "auto", maxHeight: 240 }}
                        src={thumb}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </div>
        </div>
        <div className="bottom-menus">
          <div className="bottom-menus-box" style={{ left: 0, zIndex: 1000 }}>
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

export default CertificateCreatePage;
