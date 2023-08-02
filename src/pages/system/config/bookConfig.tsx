import { useState, useEffect } from "react";
import { Spin, Form, message, Button } from "antd";
import styles from "./bookConfig.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { system, book } from "../../../api/index";
import {
  BackBartment,
  SelectBookMulti,
  HelperText,
  ThumbBar,
  CloseIcon,
} from "../../../components";

const SystemBookConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [list, setList] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBookWin, setShowBookWin] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>([]);

  useEffect(() => {
    document.title = "电子书推荐";
    dispatch(titleAction("电子书推荐"));
    getDetail();
  }, []);

  const getDetail = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    system
      .setting()
      .then((res: any) => {
        let configData = res.data["电子书"];
        let data: any = [];
        for (let index in configData) {
          if (
            configData[index].key ===
            "meedu.addons.meedu_books.pc_list_page_rec_ids"
          ) {
            if (configData[index].value && configData[index].value.length > 0) {
              data = configData[index].value.split(",").map(Number);
              setSelected(data);
            }
          }
        }
        getCourse(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  const getCourse = (sel: any) => {
    book
      .list({
        page: 1,
        size: 100000,
      })
      .then((res: any) => {
        setCourses(res.data.data.data);
        checkThumbox(res.data.data.data, sel);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const checkThumbox = (data: any, sel: any) => {
    let newbox = [];
    if (sel.length > 0) {
      for (var i = 0; i < sel.length; i++) {
        let it = data.find((o: any) => o.id === parseInt(sel[i]));
        if (it) {
          newbox.push(it);
        }
      }
    }
    setList(newbox);
  };

  const onFinish = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    system
      .saveSetting({
        config: {
          "meedu.addons.meedu_books.pc_list_page_rec_ids": selected.join(","),
        },
      })
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        getDetail();
        if (result.get("referer")) {
          navigate(String(result.get("referer")), { replace: true });
        } else {
          navigate(-1);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const delCourse = (index: number) => {
    let box1 = [...list];
    box1.splice(index, 1);
    setList(box1);
    let box2 = [...selected];
    box2.splice(index, 1);
    setSelected(box2);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="电子书推荐"></BackBartment>
      <SelectBookMulti
        selected={selected}
        open={showBookWin}
        onCancel={() => setShowBookWin(false)}
        onSelected={(arr: any) => {
          let box = [...selected];
          box = box.concat(arr);
          setSelected(box);
          setShowBookWin(false);
          checkThumbox(courses, box);
        }}
      ></SelectBookMulti>
      <div className="float-left d-flex mt-30 mb-30">
        <div>
          <Button type="primary" onClick={() => setShowBookWin(true)}>
            添加推荐
          </Button>
        </div>
        <div className="ml-10">
          <HelperText text="添加推荐的图文会在PC端图文列表右侧悬浮展示"></HelperText>
        </div>
      </div>
      {loading && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            paddingTop: 50,
            paddingBottom: 30,
            boxSizing: "border-box",
          }}
        >
          <Spin />
        </div>
      )}
      {!loading && selected && list && list.length > 0 && (
        <div className={styles["thumb-box"]}>
          {list.map((item: any, index: number) => (
            <div
              key={item.id}
              className={styles["item"]}
              onClick={() => delCourse(index)}
            >
              <div className={styles["btn-del"]}>
                <CloseIcon />
              </div>
              <ThumbBar
                width={60}
                value={item.thumb}
                height={80}
                title={""}
                border={4}
              ></ThumbBar>
            </div>
          ))}
        </div>
      )}
      <div className="bottom-menus">
        <div className="bottom-menus-box">
          <div>
            <Button loading={loading} type="primary" onClick={() => onFinish()}>
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

export default SystemBookConfigPage;
