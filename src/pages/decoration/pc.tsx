import { useState, useEffect, useRef } from "react";
import { Form, message, Button, Input, Row, Col, Dropdown } from "antd";
import type { MenuProps } from "antd";
import Draggable from "react-draggable";
import styles from "./pc.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewBlock } from "../../api/index";
import { HelperText } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { RenderNavs } from "./components/pc/render-navs";
import { RenderSliders } from "./components/pc/render-sliders";
import { RenderNotice } from "./components/pc/render-notice";
import { NavsList } from "./components/pc/render-navs/list";
import { SlidersList } from "./components/pc/render-sliders/list";
import { NoticeList } from "./components/pc/render-notice/list";
import navIcon from "../../assets/images/decoration/h5/icon-nav.png";
import announceIcon from "../../assets/images/decoration/h5/icon-announce.png";
import bannerIcon from "../../assets/images/decoration/h5/icon-banner.png";
import linkIcon from "../../assets/images/decoration/h5/icon-link.png";
import vodIcon from "../../assets/images/decoration/h5/h5-vod-v1.png";
import liveIcon from "../../assets/images/decoration/h5/h5-live-v1.png";
import bookIcon from "../../assets/images/decoration/h5/h5-book-v1.png";
import topicIcon from "../../assets/images/decoration/h5/h5-topic-v1.png";
import pathIcon from "../../assets/images/decoration/h5/h5-learn-path-v1.png";
import msIcon from "../../assets/images/decoration/h5/h5-ms-v1.png";
import tgIcon from "../../assets/images/decoration/h5/h5-tg-v1.png";
import codeIocn from "../../assets/images/decoration/h5/code.png";

const DecorationPCPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState("pc");
  const [page, setPage] = useState("pc-page-index");
  const [blocks, setBlocks] = useState<any>([]);
  const [curBlockIndex, setCurBlockIndex] = useState<any>(null);
  const [showNavWin, setShowNavWin] = useState<boolean>(false);
  const [showListWin, setShowListWin] = useState<boolean>(false);
  const [showNoticeWin, setShowNoticeWin] = useState<boolean>(false);
  const [showLinkWin, setShowLinkWin] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<any>(null);
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [lastSort, setLastSort] = useState(0);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    document.title = "电脑端装修";
    dispatch(titleAction("电脑端装修"));
    let screenWidth = document.body.clientWidth;
    if (screenWidth > 1500) {
      setPreviewWidth(1200);
    } else {
      setPreviewWidth(1000);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getScreenWidth, false);
    getData();
    return () => {
      window.removeEventListener("resize", getScreenWidth, false);
    };
  }, [page, platform]);

  useEffect(() => {
    let sort = 0;
    if (blocks.length > 0) {
      sort = blocks[blocks.length - 1].sort + 1;
    }
    setLastSort(sort);
  }, [blocks]);

  const getData = (toBottom = false) => {
    if (loading) {
      return;
    }
    setLoading(true);
    viewBlock
      .list({
        platform: platform,
        page: page,
      })
      .then((res: any) => {
        setBlocks(res.data);
        setLoading(false);
        if (toBottom) {
          const $div: any = document.getElementById("pc-dec-preview-box");
          $div.scrollTop = $div.scrollHeight;
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const getScreenWidth = () => {
    let screenWidth = document.body.clientWidth;
    if (screenWidth > 1500) {
      setPreviewWidth(1200);
    } else {
      setPreviewWidth(1000);
    }
  };

  const close = () => {
    setShowListWin(false);
    setShowLinkWin(false);
    setShowNavWin(false);
    setShowNoticeWin(false);
  };

  const dragChange = (e: any, sign: string) => {
    if (e.clientX < 249) {
      return;
    }
    if (e.clientX > 249 + previewWidth) {
      return;
    }
    if (e.clientY < 143) {
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    // 默认数据
    let defaultConfig = null;
    if (sign === "pc-vod-v1") {
      defaultConfig = {
        title: "录播课程",
        items: [
          {
            id: null,
            title: "录播课程",
            thumb: null,
            user_count: 0,
            charge: 0,
          },
          {
            id: null,
            title: "录播课程",
            thumb: null,
            user_count: 0,
            charge: 0,
          },
          {
            id: null,
            title: "录播课程",
            thumb: null,
            user_count: 0,
            charge: 0,
          },
          {
            id: null,
            title: "录播课程",
            thumb: null,
            user_count: 0,
            charge: 0,
          },
        ],
      };
    } else if (sign === "pc-live-v1") {
      defaultConfig = {
        title: "直播课程",
        items: [
          {
            id: null,
            title: "直播课程",
            thumb: null,
            charge: 0,
            videos_count: 0,
            teacher: {
              name: "教师xx",
            },
          },
          {
            id: null,
            title: "直播课程",
            thumb: null,
            charge: 0,
            videos_count: 0,
            teacher: {
              name: "教师xx",
            },
          },
          {
            id: null,
            title: "直播课程",
            thumb: null,
            charge: 0,
            videos_count: 0,
            teacher: {
              name: "教师xx",
            },
          },
          {
            id: null,
            title: "直播课程",
            thumb: null,
            charge: 0,
            videos_count: 0,
            teacher: {
              name: "教师xx",
            },
          },
        ],
      };
    } else if (sign === "pc-book-v1") {
      defaultConfig = {
        title: "电子书",
        items: [
          {
            id: null,
            name: "电子书",
            thumb: null,
            charge: 0,
          },
          {
            id: null,
            name: "电子书",
            thumb: null,
            charge: 0,
          },
          {
            id: null,
            name: "电子书",
            thumb: null,
            charge: 0,
          },
          {
            id: null,
            name: "电子书",
            thumb: null,
            charge: 0,
          },
        ],
      };
    } else if (sign === "pc-topic-v1") {
      defaultConfig = {
        title: "图文",
        items: [
          {
            id: null,
            title: "图文一",
            thumb: null,
            view_times: 0,
            category: {
              name: "未知分类",
            },
          },
          {
            id: null,
            title: "图文一",
            thumb: null,
            view_times: 0,
            category: {
              name: "未知分类",
            },
          },
          {
            id: null,
            title: "图文一",
            thumb: null,
            view_times: 0,
            category: {
              name: "未知分类",
            },
          },
          {
            id: null,
            title: "图文一",
            thumb: null,
            view_times: 0,
            category: {
              name: "未知分类",
            },
          },
        ],
      };
    } else if (sign === "pc-learnPath-v1") {
      defaultConfig = {
        title: "学习路径",
        items: [
          {
            id: null,
            name: "路径一",
            thumb: null,
            charge: 0,
            steps_count: 0,
            courses_count: 0,
            desc: "简单介绍",
          },
          {
            id: null,
            name: "路径一",
            thumb: null,
            charge: 0,
            steps_count: 0,
            courses_count: 0,
            desc: "简单介绍",
          },
        ],
      };
    } else if (sign === "pc-tg-v1") {
      defaultConfig = {
        title: "团购",
        items: [
          {
            id: null,
            goods_title: "团购商品一",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "团购商品一",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "团购商品一",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "团购商品一",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
        ],
      };
    } else if (sign === "pc-ms-v1") {
      defaultConfig = {
        title: "秒杀",
        items: [
          {
            id: null,
            goods_title: "秒杀商品",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "秒杀商品",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "秒杀商品",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
          {
            id: null,
            goods_title: "秒杀商品",
            goods_thumb: null,
            charge: 0,
            original_charge: 0,
          },
        ],
      };
    } else if (sign === "code") {
      defaultConfig = {
        html: null,
      };
    }

    viewBlock
      .store({
        platform: platform,
        page: page,
        sign: sign,
        sort: lastSort,
        config: defaultConfig,
      })
      .then((res: any) => {
        setLoading(false);
        getData();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className={styles["bg"]}>
      <div className={styles["top-box"]}>
        <div className={styles["btn-back"]} onClick={() => navigate(-1)}>
          <LeftOutlined style={{ marginRight: 4 }} />
          返回
        </div>
        <div className={styles["line"]}></div>
        <div className={styles["name"]}>电脑端首页</div>
      </div>
      <div className={styles["blocks-box"]}>
        <div className={styles["title"]}>拖动添加板块</div>
        <div className={styles["tip"]}>拖动下列图标到右侧预览区</div>
        <div className={styles["blocks"]}>
          <div
            className={styles["block-item"]}
            draggable
            onDragEnd={(e: any) => {
              dragChange(e, "pc-vod-v1");
            }}
          >
            <div className={styles["btn"]}>
              <div className={styles["icon"]}>
                <img src={vodIcon} width={44} height={44} />
              </div>
              <div className={styles["name"]}>录播</div>
            </div>
          </div>
          {enabledAddons["Zhibo"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-live-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={liveIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>直播</div>
              </div>
            </div>
          )}
          {enabledAddons["MeeduBooks"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-book-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={bookIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>电子书</div>
              </div>
            </div>
          )}
          {enabledAddons["MeeduTopics"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-topic-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={topicIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>图文</div>
              </div>
            </div>
          )}
          {enabledAddons["LearningPaths"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-learnPath-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={pathIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>路径</div>
              </div>
            </div>
          )}
          {enabledAddons["MiaoSha"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-ms-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={msIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>秒杀</div>
              </div>
            </div>
          )}
          {enabledAddons["TuanGou"] && (
            <div
              className={styles["block-item"]}
              draggable
              onDragEnd={(e: any) => {
                dragChange(e, "pc-tg-v1");
              }}
            >
              <div className={styles["btn"]}>
                <div className={styles["icon"]}>
                  <img src={tgIcon} width={44} height={44} />
                </div>
                <div className={styles["name"]}>团购</div>
              </div>
            </div>
          )}
          <div
            className={styles["block-item"]}
            draggable
            onDragEnd={(e: any) => {
              dragChange(e, "code");
            }}
          >
            <div className={styles["btn"]}>
              <div className={styles["icon"]}>
                <img src={codeIocn} width={44} height={44} />
              </div>
              <div className={styles["name"]}>代码块</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["navs-box"]}>
        <div className={styles["nav-item"]} onClick={() => setShowNavWin(true)}>
          <img src={navIcon} width={30} height={30} />
          导航管理
        </div>
        <div
          className={styles["nav-item"]}
          onClick={() => setShowNoticeWin(true)}
        >
          <img src={announceIcon} width={30} height={30} />
          公告管理
        </div>
        <div
          className={styles["nav-item"]}
          onClick={() => setShowListWin(true)}
        >
          <img src={bannerIcon} width={30} height={30} />
          轮播图片
        </div>
        <div
          className={styles["nav-item"]}
          onClick={() => setShowLinkWin(true)}
        >
          <img src={linkIcon} width={30} height={30} />
          友情链接
        </div>
        <div className={styles["tip"]}>点击预览区直接编辑板块</div>
      </div>
      <div className="pc-dec-preview-box">
        <div className="pc-box" style={{ width: previewWidth }}>
          <RenderNavs reload={showNavWin}></RenderNavs>
          <RenderSliders
            reload={showListWin}
            width={previewWidth}
          ></RenderSliders>
          <RenderNotice reload={showNoticeWin}></RenderNotice>
        </div>
      </div>
      <NavsList open={showNavWin} onClose={() => close()}></NavsList>
      <SlidersList open={showListWin} onClose={() => close()}></SlidersList>
      <NoticeList open={showNoticeWin} onClose={() => close()}></NoticeList>
    </div>
  );
};

export default DecorationPCPage;