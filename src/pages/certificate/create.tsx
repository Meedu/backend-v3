import { useState, useEffect, useRef } from "react";
import { Form, message, Button, Input, Row, Col, Dropdown } from "antd";
import type { MenuProps } from "antd";
import Draggable from "react-draggable";
import styles from "./create.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { certificate } from "../../api/index";
import {
  HelperText,
  UploadImageButton,
  SelectResourcesMulti,
} from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import foldIcon from "../../assets/images/certificate/icon-fold.png";
import unfoldIcon from "../../assets/images/certificate/icon-unfold.png";
import lowIcon from "../../assets/images/certificate/low.png";
import highIcon from "../../assets/images/certificate/high.png";
import txtIcon from "../../assets/images/certificate/icon-txt.png";
import imgIcon from "../../assets/images/certificate/icon-img.png";
import qrcodeIcon from "../../assets/images/certificate/icon-qrcode.png";
import demoImg from "../../assets/home/demo.png";
import closeIcon from "../../assets/img/icon-close-h.png";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { CertificateConfig } from "./components/certificate-config";
import { RenderImage } from "./components/render-image-v1";
import { RenderQrcode } from "./components/render-qrcode-v1";
import { RenderText } from "./components/render-text-v1";
import { checkUrl } from "../../utils/index";
import config from "../../js/config";

declare const window: any;

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
  const [blocksData, setBlocksData] = useState<any>([]);
  const [coursesData, setCoursesData] = useState<any>([]);
  const [paperData, setPaperData] = useState<any>([]);
  const [qrcodeStatus, setQrcodeStatus] = useState<any>(null);
  const [showSelectResourceCoursesWin, setShowSelectResourceCoursesWin] =
    useState<boolean>(false);
  const [showSelectResourcePaperWin, setShowSelectResourcePaperWin] =
    useState<boolean>(false);
  const [coursesVodId, setCoursesVodId] = useState<any>([]);
  const [coursesLiveId, setCoursesLiveId] = useState<any>([]);
  const [paperId, setPaperId] = useState<any>([]);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const sizeRef = useRef(0);

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

    window.addEventListener("mousewheel", handleScroll, {
      passive: false,
    });
    keyDown();

    return () => {
      window.removeEventListener("mousewheel", handleScroll, {
        passive: false,
      });
    };
  }, [thumb, imgHeight, imgWidth]);

  useEffect(() => {
    let params: any = [];
    let liveParams: any = [];
    if (coursesData.length > 0) {
      for (let i = 0; i < coursesData.length; i++) {
        if (coursesData[i].type === "vod") {
          params.push(coursesData[i].id);
        } else if (coursesData[i].type === "live") {
          liveParams.push(coursesData[i].id);
        }
      }
    }
    setCoursesVodId(params);
    setCoursesLiveId(liveParams);
  }, [coursesData]);

  useEffect(() => {
    let params: any = [];
    if (paperData.length > 0) {
      for (let i = 0; i < paperData.length; i++) {
        if (paperData[i].type === "paper") {
          params.push(paperData[i].id);
        }
      }
    }
    setPaperId(params);
  }, [paperData]);

  useEffect(() => {
    if (blocksData && blocksData.length > 0) {
      let params = [];
      for (let i = 0; i < blocksData.length; i++) {
        if (blocksData[i]) {
          if (blocksData[i].sign === "text-v1") {
            params.push({
              text: blocksData[i].config,
            });
          } else if (blocksData[i].sign === "image-v1") {
            params.push({
              image: blocksData[i].config,
            });
          } else if (blocksData[i].sign === "qrcode-v1") {
            params.push({
              qrcode: blocksData[i].config,
            });
          }
        }
      }
      form.setFieldsValue({ params: params });
    }
  }, [blocksData]);

  const handleScroll = (e: any) => {
    if (e.ctrlKey || e.metaKey) {
      // 取消浏览器默认的放大缩小网页行为
      e.preventDefault();
      // 判断是向上滚动还是向下滚动
      if (e.deltaY > 0) {
        // 放大重写，业务代码
        changeSize(0);
      } else {
        // 缩小重写，业务代码
        changeSize(-1);
      }
    }
  };

  useEffect(() => {
    xRef.current = dragX;
    yRef.current = dragY;
    sizeRef.current = size;
  }, [dragX, dragY, size]);

  const keyDown = () => {
    document.onkeydown = (e) => {
      let e1 = e || event || window.event;
      if (
        (e1.ctrlKey === true || e1.metaKey === true) &&
        (e1.which === 61 ||
          e1.which === 107 ||
          e1.which === 173 ||
          e1.which === 109 ||
          e1.which === 187 ||
          e1.which === 189)
      ) {
        e1.preventDefault();
        if (e1.which === 187) {
          changeSize(0);
        } else if (e1.which === 189) {
          changeSize(-1);
        }
      }
      //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      if (e1 && e1.keyCode == 37) {
        if (!thumb) {
          return;
        }
        let value = xRef.current - 50;
        setDragX(value);
      } else if (e1 && e1.keyCode == 39) {
        if (!thumb) {
          return;
        }
        let value = xRef.current + 50;
        setDragX(value);
      } else if (e1 && e1.keyCode == 38) {
        if (!thumb) {
          return;
        }

        let value = yRef.current - 50;
        setDragY(value);
      } else if (e1 && e1.keyCode == 40) {
        if (!thumb) {
          return;
        }
        let value = yRef.current + 50;
        setDragY(value);
      }
    };
  };

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
    if (blocksData.length === 0) {
      message.warning("请配置好证书元素");
      return;
    }
    values.params = JSON.stringify(values.params);

    let courses: any = [];
    if (coursesData.length > 0) {
      courses = courses.concat(coursesData);
    }
    if (paperData.length > 0) {
      courses = courses.concat(paperData);
    }
    values.courses = courses;
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

  const createQrcode = (obj: any, val: boolean) => {
    if (obj) {
      let box = [...blocksData];
      box[curBlockIndex] = obj;
      setBlocksData(box);
      setQrcodeStatus(val);
    }
  };

  const changeSize = (val: number) => {
    if (!thumb) {
      message.error("请上传证书背景后在改变缩放比例");
      return;
    }
    if (val === -1) {
      if (sizeRef.current === 0.25) {
        return;
      }
      let newSize = sizeRef.current - 0.25;
      setSize(newSize);
      setOriginalHeight(newSize * imgHeight);
      setOriginalWidth(newSize * imgWidth);
      setDragX(0.5 * (window.screen.width - newSize * imgWidth));
      setDragY(106);
    } else if (val === 0) {
      if (sizeRef.current === 2) {
        return;
      }
      let newSize = sizeRef.current + 0.25;
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

  const getIndex = (obj: any, val: boolean) => {
    if (obj) {
      let box = [...blocksData];
      box[curBlockIndex] = obj;
      setBlocksData(box);
      setRightIndex(val);
    }
  };

  const changeCourses = (data: any) => {
    let box = [...coursesData];
    box = box.concat(data);
    setCoursesData(box);

    setShowSelectResourceCoursesWin(false);
  };

  const delCourses = (index: number) => {
    const data = [...coursesData];
    data.splice(index, 1);
    if (data.length > 0) {
      setCoursesData(data);
    } else {
      setCoursesData([]);
    }
  };

  const changePapers = (data: any) => {
    let box = [...paperData];
    box = box.concat(data);
    setPaperData(box);

    setShowSelectResourcePaperWin(false);
  };

  const delPapers = (index: number) => {
    const data = [...paperData];
    data.splice(index, 1);
    if (data.length > 0) {
      setPaperData(data);
    } else {
      setPaperData([]);
    }
  };

  const blockDestroy = (index: number) => {
    let box = [...blocksData];
    box.splice(index, 1);
    setBlocksData(box);
    setCurBlockIndex(null);
  };

  return (
    <div className="content">
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
                    text={uploadName}
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
                      name="params"
                      rules={[{ required: true, message: "请配置好证书元素!" }]}
                    >
                      <HelperText text="拖动元素到证书背景上编辑参数"></HelperText>
                    </Form.Item>
                  </>
                )}
              </Form>
            </div>
            {thumb && (
              <>
                <div className={styles["blocks"]}>
                  <div
                    draggable
                    className={styles["block-item"]}
                    id="text-v1"
                    onDragEnd={(e: any) => {
                      if (e.clientX < dragX) {
                        return;
                      }
                      if (e.clientY < dragY) {
                        return;
                      }
                      if (e.clientX > dragX + originalWidth) {
                        return;
                      }
                      if (e.clientY > dragY + originalHeight) {
                        return;
                      }
                      let defaultConfig = {
                        x: (e.clientX - dragX) / sizeRef.current,
                        y: (e.clientY - dragY) / sizeRef.current,
                        font: "default",
                        size: 40,
                        color: "#333333",
                        text: "默认文字",
                      };
                      let box = [...blocksData];
                      box.push({
                        sign: "text-v1",
                        config: defaultConfig,
                      });
                      setBlocksData(box);
                      setCurBlockIndex(box.length - 1);
                    }}
                  >
                    <div className={styles["btn"]}>
                      <div className={styles["icon"]}>
                        <img src={txtIcon} width={44} height={44} />
                      </div>
                      <div className={styles["name"]}>文本</div>
                    </div>
                  </div>
                  <div
                    draggable
                    className={styles["block-item"]}
                    id="image-v1"
                    onDragEnd={(e: any) => {
                      if (e.clientX < dragX) {
                        return;
                      }
                      if (e.clientY < dragY) {
                        return;
                      }
                      if (e.clientX > dragX + originalWidth) {
                        return;
                      }
                      if (e.clientY > dragY + originalHeight) {
                        return;
                      }
                      let defaultConfig = {
                        x: (e.clientX - dragX) / sizeRef.current,
                        y: (e.clientY - dragY) / sizeRef.current,
                        width: 200,
                        height: 200,
                        url: demoImg,
                      };
                      let box = [...blocksData];
                      box.push({
                        sign: "image-v1",
                        config: defaultConfig,
                      });
                      setBlocksData(box);
                      setCurBlockIndex(box.length - 1);
                    }}
                  >
                    <div className={styles["btn"]}>
                      <div className={styles["icon"]}>
                        <img src={imgIcon} width={44} height={44} />
                      </div>
                      <div className={styles["name"]}>图片</div>
                    </div>
                  </div>
                  <div
                    className={styles["block-item"]}
                    draggable
                    id="qrcode-v1"
                    onDragEnd={(e: any) => {
                      if (e.clientX < dragX) {
                        return;
                      }
                      if (e.clientY < dragY) {
                        return;
                      }
                      if (e.clientX > dragX + originalWidth) {
                        return;
                      }
                      if (e.clientY > dragY + originalHeight) {
                        return;
                      }
                      let defaultConfig = {
                        x: (e.clientX - dragX) / sizeRef.current,
                        y: (e.clientY - dragY) / sizeRef.current,
                        width: 200,
                        height: 200,
                        text:
                          checkUrl(config.url) + "addons/Cert/dist/index.html",
                      };
                      let box = [...blocksData];
                      box.push({
                        sign: "qrcode-v1",
                        config: defaultConfig,
                      });
                      setBlocksData(box);
                      setCurBlockIndex(box.length - 1);
                    }}
                  >
                    <div className={styles["btn"]}>
                      <div className={styles["icon"]}>
                        <img src={qrcodeIcon} width={44} height={44} />
                      </div>
                      <div className={styles["name"]}>证书二维码</div>
                    </div>
                  </div>
                </div>
                <div className="d-flex float-left mt-30">
                  <div className={styles["label"]}>关联学习</div>
                  <HelperText text="添加证书二维码查询"></HelperText>
                </div>
                <div className="float-left mt-30">
                  <div className="d-flex float-left">
                    <div className={styles["label-item"]}>关联课程</div>
                    <Button
                      onClick={() => setShowSelectResourceCoursesWin(true)}
                    >
                      添加关联
                    </Button>
                    <SelectResourcesMulti
                      type={true}
                      selectedVod={coursesVodId}
                      selectedLive={coursesLiveId}
                      selectedBook={[]}
                      selectedPaper={[]}
                      selectedMockPaper={[]}
                      selectedPractice={[]}
                      selectedVip={[]}
                      open={showSelectResourceCoursesWin}
                      enabledResource={"vod,live"}
                      onCancel={() => setShowSelectResourceCoursesWin(false)}
                      onSelected={(result: any) => {
                        changeCourses(result);
                      }}
                    ></SelectResourcesMulti>
                  </div>
                  {coursesData.length > 0 && (
                    <div className={styles["courses-multi-box"]}>
                      {coursesData.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={styles["courses-multi-item"]}
                        >
                          <img
                            src={closeIcon}
                            className={styles["close"]}
                            width={15}
                            height={15}
                            onClick={() => {
                              delCourses(index);
                            }}
                          />
                          <img src={item.thumb} width={80} height={60} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="d-flex float-left mt-30">
                    <div className={styles["label-item"]}>关联考试</div>
                    <Button onClick={() => setShowSelectResourcePaperWin(true)}>
                      添加关联
                    </Button>
                    <SelectResourcesMulti
                      type={false}
                      selectedVod={[]}
                      selectedLive={[]}
                      selectedBook={[]}
                      selectedPaper={paperId}
                      selectedMockPaper={[]}
                      selectedPractice={[]}
                      selectedVip={[]}
                      open={showSelectResourcePaperWin}
                      enabledResource={"paper"}
                      onCancel={() => setShowSelectResourcePaperWin(false)}
                      onSelected={(result: any) => {
                        changePapers(result);
                      }}
                    ></SelectResourcesMulti>
                  </div>
                  {paperData.length > 0 && (
                    <div className={styles["paper-multi-box"]}>
                      {paperData.map((item: any, index: number) => (
                        <div key={index} className={styles["paper-multi-item"]}>
                          <img
                            src={closeIcon}
                            className={styles["close"]}
                            width={15}
                            height={15}
                            onClick={() => {
                              delPapers(index);
                            }}
                          />
                          {item.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
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
          <Draggable
            handle={".image-box"}
            bounds={{ right: 0, left: 0, top: 0, bottom: 0 }}
            onDrag={(e: any) => {
              setDragX(e.x);
              setDragY(e.y);
            }}
          >
            <div
              style={{
                width: originalWidth,
                height: originalHeight,
                top: dragY,
                left: dragX,
              }}
              className="preview-box"
            >
              <div
                style={{
                  backgroundImage: "url(" + thumb + ")",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="image-box"
              ></div>
              {blocksData.length > 0 &&
                blocksData.map((item: any, index: number) => {
                  return item.sign === "image-v1" ? (
                    <RenderImage
                      key={index}
                      current={index}
                      status={curBlockIndex}
                      size={size}
                      config={item.config}
                      onChange={(width: number, height: number) => {
                        let box = [...blocksData];
                        box[index].config.width = width;
                        box[index].config.height = height;
                        setBlocksData(box);
                      }}
                      onDragend={(sign: string, x: number, y: number) => {
                        let box = [...blocksData];
                        box[index].config.x = x;
                        box[index].config.y = y;
                        setBlocksData(box);
                      }}
                      onDel={(current: number) => {
                        blockDestroy(current);
                      }}
                      onActive={(current: number) => {
                        setCurBlockIndex(current);
                      }}
                    ></RenderImage>
                  ) : item.sign === "qrcode-v1" ? (
                    <RenderQrcode
                      key={index}
                      current={index}
                      status={curBlockIndex}
                      size={size}
                      config={item.config}
                      onChange={(width: number, height: number) => {
                        let box = [...blocksData];
                        box[index].config.width = width;
                        box[index].config.height = height;
                        setBlocksData(box);
                      }}
                      onDragend={(sign: string, x: number, y: number) => {
                        let box = [...blocksData];
                        box[index].config.x = x;
                        box[index].config.y = y;
                        setBlocksData(box);
                      }}
                      onDel={(current: number) => {
                        blockDestroy(current);
                      }}
                      onActive={(current: number) => {
                        setCurBlockIndex(current);
                      }}
                    ></RenderQrcode>
                  ) : (
                    <RenderText
                      key={index}
                      current={index}
                      status={curBlockIndex}
                      size={size}
                      config={item.config}
                      onDragend={(sign: string, x: number, y: number) => {
                        let box = [...blocksData];
                        box[index].config.x = x;
                        box[index].config.y = y;
                        setBlocksData(box);
                      }}
                      onDel={(current: number) => {
                        blockDestroy(current);
                      }}
                      onActive={(current: number) => {
                        setCurBlockIndex(current);
                      }}
                    ></RenderText>
                  );
                })}
            </div>
          </Draggable>

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
              <CertificateConfig
                block={blocksData[curBlockIndex]}
                onCreate={(obj, val) => createQrcode(obj, val)}
                onChange={(obj, val) => getIndex(obj, val)}
              ></CertificateConfig>
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
    </div>
  );
};

export default CertificateCreatePage;
