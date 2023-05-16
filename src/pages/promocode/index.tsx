import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  message,
  Drawer,
  Input,
  Button,
  Tag,
  DatePicker,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { promocode } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface DataType {
  id: React.Key;
  used_times: number;
  expired_at: string;
  created_at: string;
}

const PromoCodePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [key, setKey] = useState<string>("");
  const [user_id, setUserId] = useState("");
  const [created_at, setCreatedAt] = useState<any>([]);
  const [expired_at, setExpiredAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);
  const [expiredAts, setExpiredAts] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    document.title = "优惠码";
    dispatch(titleAction("优惠码"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  useEffect(() => {
    if (
      (created_at && created_at.length > 0) ||
      (expired_at && expired_at.length > 0) ||
      user_id ||
      key
    ) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  }, [created_at, expired_at, user_id, key]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    promocode
      .list({
        page: page,
        size: size,
        user_id: user_id,
        key: key,
        created_at: created_at,
        expired_at: expired_at,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的优惠码？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        promocode
          .destroyMulti({
            ids: selectedRowKeys,
          })
          .then(() => {
            message.success("成功");
            resetList();
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setKey("");
    setUserId("");
    setExpiredAts([]);
    setExpiredAt([]);
    setExpiredAts([]);
    setCreatedAt([]);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "优惠码",
      render: (_, record: any) => (
        <>
          <div className="mb-10">{record.code}</div>
          <div>面值：{record.invited_user_reward}元</div>
          <div>奖励：{record.invite_user_reward}元</div>
        </>
      ),
    },
    {
      title: "可使用次数",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.use_times === 0 && <Tag color="error">不限制</Tag>}
          {record.use_times !== 0 && <Tag>{record.use_times || 0}次</Tag>}
        </>
      ),
    },
    {
      title: "已使用次数",
      width: 150,
      dataIndex: "used_times",
      render: (used_times: number) => <span>{used_times || 0}次</span>,
    },
    {
      title: "过期时间",
      width: 200,
      dataIndex: "expired_at",
      render: (expired_at: string) => <span>{dateFormat(expired_at)}</span>,
    },
    {
      title: "添加时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="danger"
            text="批量删除"
            class=""
            icon={null}
            p="promoCode.destroy.multi"
            onClick={() => destorymulti()}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="添加"
            class="ml-10"
            icon={null}
            p="promoCode.store"
            onClick={() => navigate("/createcode")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量导入"
            class="ml-10"
            icon={null}
            p="promoCode.store"
            onClick={() => navigate("/order/code-import")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量生成"
            class="ml-10"
            icon={null}
            p="promoCode.generator"
            onClick={() => navigate("/createmulticode")}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="优惠码"
          />
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="学员ID"
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
      <Drawer
        title="更多筛选"
        onClose={() => setDrawer(false)}
        maskClosable={false}
        open={drawer}
        footer={
          <Space className="j-b-flex">
            <Button
              onClick={() => {
                resetList();
                setDrawer(false);
              }}
            >
              清空
            </Button>
            <Button
              onClick={() => {
                setPage(1);
                setRefresh(!refresh);
                setDrawer(false);
              }}
              type="primary"
            >
              筛选
            </Button>
          </Space>
        }
        width={360}
      >
        <div className="float-left">
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            allowClear
            placeholder="优惠码"
          />
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ marginTop: 20 }}
            placeholder="学员ID"
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={expiredAts}
            style={{ marginTop: 20 }}
            onChange={(date, dateString) => {
              setExpiredAt(dateString);
              setExpiredAts(date);
            }}
            placeholder={["过期时间-开始", "过期时间-结束"]}
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={createdAts}
            style={{ marginTop: 20 }}
            onChange={(date, dateString) => {
              setCreatedAt(dateString);
              setCreatedAts(date);
            }}
            placeholder={["添加时间-开始", "添加时间-结束"]}
          />
        </div>
      </Drawer>
    </div>
  );
};
export default PromoCodePage;