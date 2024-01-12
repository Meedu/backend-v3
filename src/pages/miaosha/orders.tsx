import { useState, useEffect } from "react";
import { Table, Tabs, Input, Button, Tag, DatePicker } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { miaosha } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, ThumbBar } from "../../components";
import { dateFormat } from "../../utils/index";
const { RangePicker } = DatePicker;
import moment from "moment";
import dayjs from "dayjs";

interface DataType {
  id: React.Key;
  user_id: number;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  user_id?: string;
  resourceActive?: string;
  created_at?: any;
}

const MiaoshaOrdersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    user_id: "",
    resourceActive: "1",
    created_at: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const user_id = searchParams.get("user_id");
  const resourceActive = searchParams.get("resourceActive") || "1";
  const created_at = JSON.parse(searchParams.get("created_at") || "[]");
  const [createdAts, setCreatedAts] = useState<any>(
    created_at.length > 0
      ? [dayjs(created_at[0], "YYYY-MM-DD"), dayjs(created_at[1], "YYYY-MM-DD")]
      : []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const types = [
    {
      key: "1",
      label: "已支付",
    },
    {
      key: "0",
      label: "未支付",
    },
    {
      key: "3",
      label: "已取消",
    },
  ];

  useEffect(() => {
    document.title = "秒杀订单";
    dispatch(titleAction("秒杀订单"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    getData();
  }, [result.get("id"), page, size, refresh, resourceActive]);

  const getData = () => {
    if (loading) {
      return;
    }
    let time = [...created_at];
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    setLoading(true);
    miaosha
      .ordersList({
        page: page,
        size: size,
        status: resourceActive,
        gid: id,
        user_id: user_id,
        created_at: time,
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.user_id !== "undefined") {
          prev.set("user_id", params.user_id);
        }
        if (typeof params.resourceActive !== "undefined") {
          prev.set("resourceActive", params.resourceActive);
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
      created_at: [],
    });
    setList([]);
    setCreatedAts([]);
    setRefresh(!refresh);
  };

  const onChange = (key: string) => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      resourceActive: key,
    });
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
      title: "商品名称",
      width: 400,
      render: (_, record: any) => (
        <>
          {!record.goods && <span className="c-red">商品已删除</span>}
          {record.goods && (
            <ThumbBar
              value={record.goods.goods_thumb}
              width={120}
              height={90}
              title={record.goods.goods_title}
              border={4}
            ></ThumbBar>
          )}
        </>
      ),
    },
    {
      title: "学员",
      width: 300,
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
      title: "秒杀价",
      width: 150,
      render: (_, record: any) => <div>{record.charge}元</div>,
    },
    {
      title: "状态",
      width: 100,
      render: (_, record: any) => (
        <>
          {record.status === 1 && <Tag color="success">已支付</Tag>}
          {record.status !== 1 && <Tag color="default">未支付</Tag>}
        </>
      ),
    },
    {
      title: "时间",
      width: 200,
      render: (_, record: any) => <div>{dateFormat(record.created_at)}</div>,
    },
  ];

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, "days"); // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="秒杀订单" />
      <div className="float-left mt-30">
        <Input
          value={user_id || ""}
          onChange={(e) => {
            resetLocalSearchParams({
              user_id: e.target.value,
            });
          }}
          allowClear
          style={{ width: 150 }}
          placeholder="学员ID"
        />
        <RangePicker
          disabledDate={disabledDate}
          format={"YYYY-MM-DD"}
          value={createdAts}
          style={{ marginLeft: 10 }}
          onChange={(date, dateString) => {
            setCreatedAts(date);
            resetLocalSearchParams({
              created_at: dateString,
            });
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
            });
            setRefresh(!refresh);
          }}
        >
          筛选
        </Button>
      </div>
      <div className="float-left mt-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
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

export default MiaoshaOrdersPage;
