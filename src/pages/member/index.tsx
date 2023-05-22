import { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
  Drawer,
  Input,
  Button,
  DatePicker,
  Space,
  Tabs,
  Dropdown,
  Modal,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { member } from "../../api/index";
import { PerButton } from "../../components";
import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface DataType {
  id: React.Key;
  created_at: string;
  credit1: number;
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
  const [keywords, setKeywords] = useState<string>("");
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setKeywords("");
    setRefresh(!refresh);
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const addMember = () => {};

  const sendMessageMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要发消息的学员");
      return;
    }
  };

  const editMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请先勾选要批量设置的学员");
      return;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: "6%",
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "学员",
      width: "15%",
      render: (_, record: any) => (
        <>
          <div className="user-item d-flex">
            <div className="avatar">
              <img src={record.avatar} width="40" height="40" />
            </div>
            <div className="ml-10">{record.nick_name}</div>
          </div>
        </>
      ),
    },
    {
      title: "手机号码",
      width: "11%",
      render: (_, record: any) => (
        <>
          {record.mobile && <span>{record.mobile}</span>}
          {!record.mobile && <span>-</span>}
        </>
      ),
    },
    {
      title: "VIP类型",
      width: "8%",
      render: (_, record: any) => (
        <>
          {record.role && <span>{record.role.name}</span>}
          {!record.role && <span>-</span>}
        </>
      ),
    },
    {
      title: "积分",
      width: 150,
      dataIndex: "credit1",
      render: (credit1: number) => <span>{credit1}</span>,
    },
  ];

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="添加学员"
            class=""
            icon={null}
            p="member.store"
            onClick={() => addMember()}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="学员批量导入"
            class="ml-10"
            icon={null}
            p="member.store"
            onClick={() => sendMessageMulti()}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量发消息"
            class="ml-10"
            icon={null}
            p="member.message.send"
            onClick={() => navigate("/member/import")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量设置"
            class="ml-10"
            icon={null}
            p="member.update"
            onClick={() => editMulti()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="昵称或手机号"
          />

          <Button className="ml-10" onClick={resetList}>
            清空
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => {
              setPage(1);
              setRefresh(!refresh);
              setDrawer(false);
            }}
          >
            筛选
          </Button>
          <div
            className="drawerMore d-flex ml-10"
            onClick={() => setDrawer(true)}
          >
            {showStatus && (
              <>
                <img src={filterHIcon} />
                <span className="act">已选</span>
              </>
            )}
            {!showStatus && (
              <>
                <img src={filterIcon} />
                <span>更多</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="float-left mb-30 check-num">
        已选择{selectedRowKeys.length}项
      </div>
      <div className="float-left">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={paginationProps}
        />
      </div>
    </div>
  );
};

export default MemberPage;
