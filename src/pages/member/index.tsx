import { useState, useEffect } from "react";
import { Table, Modal, Space, message, Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { member } from "../../api/index";
import { PerButton } from "../../components";
import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const MemberPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "学员列表";
    dispatch(titleAction("学员列表"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .list({
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return <div className="meedu-main-body"></div>;
};

export default MemberPage;
