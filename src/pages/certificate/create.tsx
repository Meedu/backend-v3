import { useState, useEffect } from "react";
import { Form, Space, message, Button, Input, Row, Col, Dropdown } from "antd";
import type { MenuProps } from "antd";
import styles from "./create.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { certificate } from "../../api/index";
import { HelperText, PerButton, UploadImageButton } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import foldIcon from "../../assets/images/certificate/icon-fold.png";
import unfoldIcon from "../../assets/images/certificate/icon-unfold.png";
import lowIcon from "../../assets/images/certificate/low.png";
import highIcon from "../../assets/images/certificate/high.png";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";

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
  const [curBlockIndex, setCurBlockIndex] = useState<any>(null);
  const [rightIndex, setRightIndex] = useState<any>(null);

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

  const changeSize = (val: number) => {
    if (!thumb) {
      message.error("请上传证书背景后在改变缩放比例");
      return;
    }
    if (val === -1) {
      if (size === 0.25) {
        return;
      }
      let newSize = size - 0.25;
      setSize(newSize);
      setOriginalHeight(newSize * imgHeight);
      setOriginalWidth(newSize * imgWidth);
      setDragX(0.5 * (window.screen.width - newSize * imgWidth));
      setDragY(106);
    } else if (val === 0) {
      if (size === 2) {
        return;
      }
      let newSize = size + 0.25;
      setSize(newSize);
      setOriginalHeight(newSize * imgHeight);
      setOriginalWidth(newSize * imgWidth);
      setDragX(0.5 * (window.screen.width - newSize * imgWidth));
      setDragY(106);
    } else {
      let newSize = val;
      setSize(newSize);
      setOriginalHeight(newSize * imgHeight);
      setOriginalWidth(newSize * imgWidth);
      setDragX(0.5 * (window.screen.width - newSize * imgWidth));
      setDragY(106);
    }
  };

  const itemsChoose: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={() => changeSize(2)}>200%</span>,
    },
    {
      key: "2",
      label: <span onClick={() => changeSize(1.5)}>150%</span>,
    },
    {
      key: "3",
      label: <span onClick={() => changeSize(1)}>100%</span>,
    },
    {
      key: "4",
      label: <span onClick={() => changeSize(0.5)}>50%</span>,
    },
    {
      key: "5",
      label: <span onClick={() => changeSize(0.25)}>25%</span>,
    },
  ];

  const getIndex = (val: number) => {
    setRightIndex(val);
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
                <>
                  <Row style={{ marginBottom: 22 }}>
                    <Col span={6}></Col>
                    <Col span={18}>
                      <div className={styles["left-preview-box"]}>
                        <img
                          style={{
                            maxWidth: 180,
                            width: "auto",
                            maxHeight: 240,
                          }}
                          src={thumb}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Form.Item
                    label="证书元素"
                    name="name"
                    rules={[{ required: true, message: "请配置好证书元素!" }]}
                  >
                    <HelperText text="拖动元素到证书背景上编辑参数"></HelperText>
                  </Form.Item>
                </>
              )}
            </Form>
          </div>
        </div>
        {thumb && (
          <div
            className={
              curBlockIndex !== null
                ? styles["choose-right-size-box"]
                : styles["choose-size-box"]
            }
          >
            <div
              className={styles["tab_narrow"]}
              onClick={() => changeSize(-1)}
            >
              <img src={lowIcon} width={12} height={12} />
            </div>
            <div className={styles["choose_size"]}>
              <Dropdown menu={{ items: itemsChoose }}>
                <span> {size * 100}% </span>
              </Dropdown>
            </div>
            <div
              className={styles["tab_enlarge"]}
              onClick={() => changeSize(0)}
            >
              <img src={highIcon} width={12} height={12} />
            </div>
          </div>
        )}
        {curBlockIndex !== null && (
          <div
            className={
              rightIndex
                ? styles["act-certificate-config-box"]
                : styles["certificate-config-box"]
            }
          >
            <div className="float-left mb-15">
              <Button
                className="ml-15 mt-15"
                icon={<CloseOutlined />}
                onClick={() => {
                  setCurBlockIndex(null);
                }}
              >
                关闭配置
              </Button>
            </div>
          </div>
        )}
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
