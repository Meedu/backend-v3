import { useState, useEffect } from "react";
import { Form, Space, message, Button } from "antd";
import styles from "./create.module.scss";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { certificate } from "../../api/index";
import { PerButton, BackBartment } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import foldIcon from "../../assets/images/certificate/icon-fold.png";
import unfoldIcon from "../../assets/images/certificate/icon-unfold.png";
import { LeftOutlined } from "@ant-design/icons";

const CertificateCreatePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [leftArrrow, setLeftArrrow] = useState<boolean>(false);

  useEffect(() => {
    document.title = "新建证书";
    dispatch(titleAction("新建证书"));
  }, []);

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
        ></div>
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
