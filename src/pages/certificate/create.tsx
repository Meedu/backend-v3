import { useState, useEffect } from "react";
import { Table, Space, message, Button } from "antd";
import type { MenuProps } from "antd";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

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
      </div>
    </div>
  );
};

export default CertificateCreatePage;
