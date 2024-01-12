import { useState, useEffect } from "react";
import { Table, Select, Input, DatePicker, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { order } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  user_id?: string;
  is_paid?: number;
  created_at?: any;
}

const OrderRechargePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    user_id: "",
    is_paid: "-1",
    created_at: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const [user_id, setUserId] = useState(searchParams.get("user_id") || "");
  const [is_paid, setIsPaid] = useState(
    Number(searchParams.get("is_paid") || -1)
  );
  const [created_at, setCreatedAt] = useState<any>(
    JSON.parse(searchParams.get("created_at") || "[]")
  );
  const [createdAts, setCreatedAts] = useState<any>(
    created_at.length > 0
      ? [dayjs(created_at[0], "YYYY-MM-DD"), dayjs(created_at[1], "YYYY-MM-DD")]
      : []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
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
    let time = created_at;
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    setLoading(true);
    order
      .rechargeOrders({
        page: page,
        size: size,
        user_id: user_id,
        is_paid: is_paid,
        created_at: time,
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.user_id !== "undefined") {
          prev.set("user_id", params.user_id);
        }
        if (typeof params.is_paid !== "undefined") {
          prev.set("is_paid", params.is_paid + "");
        }
        if (typeof params.created_at !== "undefined") {
          prev.set("created_at", JSON.stringify(params.created_at));
        }
        if (typeof params.page !== "undefined") {
          prev.set("page", params.page + "");
        }
        if (typeof params.size !== "undefined") {
          prev.set("size", params.size + "");
        }
        return prev;
      },
      { replace: true }
    );
  };

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      user_id: "",
      is_paid: -1,
      created_at: [],
    });
    setList([]);
    setUserId("");
    setIsPaid(-1);
    setCreatedAt([]);
    setCreatedAts([]);
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
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
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
              setCreatedAts(date);
              setCreatedAt(dateString);
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
              resetLocalSearchParams({
                page: 1,
                user_id: user_id,
                is_paid: typeof is_paid !== "undefined" ? is_paid : -1,
                created_at: created_at,
              });
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
