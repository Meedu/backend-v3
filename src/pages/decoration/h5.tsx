import { useState, useEffect } from "react";
import { Modal, message, Button } from "antd";
import styles from "./h5.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewBlock } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  CloseOutlined,
  UpOutlined,
  DownOutlined,
  CopyOutlined,
  DeleteOutlined,
  LeftOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;

const DecorationH5Page = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState("h5");
  const [page, setPage] = useState("h5-page-index");
  const [blocks, setBlocks] = useState<any>([]);
  const [curBlock, setCurBlock] = useState<any>(null);

  return (
    <div className={styles["bg"]}>
      <div className={styles["top-box"]}>
        <div className={styles["btn-back"]} onClick={() => navigate(-1)}>
          <LeftOutlined style={{ marginRight: 4 }} />
          返回
        </div>
        <div className={styles["line"]}></div>
        <div className={styles["name"]}>移动端首页</div>
      </div>
      
    </div>
  );
};

export default DecorationH5Page;
