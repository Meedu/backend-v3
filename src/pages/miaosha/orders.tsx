import { useState, useEffect } from "react";
import { Table, Tabs, Input, Button, Tag, DatePicker } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { miaosha } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, ThumbBar } from "../../components";
import { dateFormat } from "../../utils/index";
const { RangePicker } = DatePicker;
import moment from "moment";

interface DataType {
  id: React.Key;
  user_id: number;
}

const MiaoshaOrdersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [created_at, setCreatedAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);
  const [resourceActive, setResourceActive] = useState<string>("1");
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
    setLoading(true);
    miaosha
      .ordersList({
        page: page,
        size: size,
        status: resourceActive,
        gid: id,
        user_id: user_id,
        created_at: created_at,
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
    setUserId("");
    setCreatedAts([]);
    setCreatedAt([]);
    setRefresh(!refresh);
  };

  const onChange = (key: string) => {
    setResourceActive(key);
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
          value={user_id}
          onChange={(e) => {
            setUserId(e.target.value);
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
