import { useState, useEffect } from "react";
import { Table, Select, Input, DatePicker, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { order } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";
const { RangePicker } = DatePicker;

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

const OrderRechargePage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [is_paid, setIsPaid] = useState(-1);
  const [created_at, setCreatedAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);
  const [credit2_name, setCredit2Name] = useState<string>("");
  const statusRows = [
    {
      value: -1,
      label: "全部",
    },
    {
      value: 0,
      label: "未支付",
    },
    {
      value: 1,
      label: "已支付",
    },
  ];

  useEffect(() => {
    document.title = "iOS充值";
    dispatch(titleAction("iOS充值"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    order
      .rechargeOrders({
        page: page,
        size: size,
        user_id: user_id,
        is_paid: is_paid,
        created_at: created_at,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setCredit2Name(res.data.credit2_name);
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
    setUserId("");
    setIsPaid(-1);
    setCreatedAts([]);
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
      width: 60,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "学员ID",
      width: 100,
      dataIndex: "user_id",
      render: (user_id: number) => <span>{user_id}</span>,
    },
    {
      title: "学员",
      width: 250,
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.nick_name}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: "TransactionID",
      width: 200,
      render: (_, record: any) => <span>{record.transaction_id}</span>,
    },
    {
      title: "商品",
      render: (_, record: any) => (
        <>
          {record.product && (
            <span>
              {record.product.amount}
              {credit2_name}
            </span>
          )}
          {!record.product && <span className="c-red">无商品</span>}
        </>
      ),
    },
    {
      title: "数量",
      width: 100,
      render: (_, record: any) => <span>{record.goods_count}</span>,
    },
    {
      title: "实际支付",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.product && (
            <span>{record.product.charge * record.goods_count}元</span>
          )}
          {!record.product && <span>0元</span>}
        </>
      ),
    },
    {
      title: "状态",
      width: 100,
      render: (_, record: any) => (
        <>
          {record.is_paid === 1 && <span className="c-green">· 已支付</span>}
          {record.is_paid !== 1 && <span className="c-red">· 未支付</span>}
        </>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
  ];

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={is_paid}
            onChange={(e) => {
              setIsPaid(e);
            }}
            allowClear
            placeholder="状态"
            options={statusRows}
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={createdAts}
            style={{ marginLeft: 10 }}
            onChange={(date, dateString) => {
              dateString[1] += " 23:59:59";
              setCreatedAt(dateString);
              setCreatedAts(date);
            }}
            placeholder={["开始日期", "结束日期"]}
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
            }}
          >
            筛选
          </Button>
        </div>
      </div>
      <div className="float-left">
        <Table
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

export default OrderRechargePage;
