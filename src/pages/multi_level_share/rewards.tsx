import { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";

interface DataType {
  id: React.Key;
  order_id: number;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  order_id?: string;
}

const MultiShareRewardsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "50",
    order_id: "",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "50");
  const [order_id, setOrderId] = useState(searchParams.get("order_id") || "");

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "奖励记录";
    dispatch(titleAction("奖励记录"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    multiShare
      .rewards({
        page: page,
        size: size,
        order_id: order_id,
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.order_id !== "undefined") {
          prev.set("order_id", params.order_id);
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
      size: 50,
      order_id: "",
    });
    setList([]);
    setOrderId("");
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
      title: "支付订单",
      width: 200,
      render: (_, reocrd: any) => (
        <>
          <span>{reocrd.order.order_id}</span>
          <br></br>
          <span style={{ color: "rgba(0,0,0,.2)" }}>ID: {reocrd.order_id}</span>
        </>
      ),
    },
    {
      title: "订单商品",
      render: (_, record: any) => (
        <div className="d-flex">
          {record.order.goods &&
            record.order.goods.map((item: any) => (
              <div className="mr-10" key={item.id}>
                {item.goods_name}
              </div>
            ))}
          {!record.order.goods && <span>-</span>}
        </div>
      ),
    },
    {
      title: "支付用户",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.order_user && (
            <div className="user-item d-flex">
              <div>
                <span>{record.order_user.nick_name}</span>
                <br></br>
                <span style={{ color: "rgba(0,0,0,.2)" }}>
                  ID: {record.order_user.id}
                </span>
              </div>
            </div>
          )}
          {!record.order_user && <span className="c-red">-</span>}
        </>
      ),
    },
    {
      title: "一级学员奖励",
      width: 260,
      render: (_, record: any) => (
        <>
          {record.user1 ? (
            <div
              style={{ color: "rgba(255,0,0,1)" }}
              className="flex flex-column"
            >
              <div>{record.user1.nick_name}</div>
              <div>{record.reward1}元</div>
            </div>
          ) : null}
          {!record.user1 && <span>-</span>}
        </>
      ),
    },
    {
      title: "二级学员奖励",
      width: 260,
      render: (_, record: any) => (
        <>
          {record.user2 ? (
            <div
              style={{ color: "rgba(255,0,0,.6)" }}
              className="flex flex-column"
            >
              <div>{record.user2.nick_name}</div>
              <div>{record.reward2}元</div>
            </div>
          ) : null}
          {!record.user2 && <span>-</span>}
        </>
      ),
    },
  ];

  return (
    <div className="meedu-main-body">
      <BackBartment title="奖励记录" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <Input
            value={order_id}
            onChange={(e) => {
              setOrderId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="订单ID"
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
                order_id: order_id,
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

export default MultiShareRewardsPage;
