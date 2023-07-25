import { useState, useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { live } from "../../api/index";
import { useDispatch } from "react-redux";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, DurationText } from "../../components";

interface DataType {
  id: React.Key;
  created_at: string;
  chat_count: number;
  user_count: number;
  real_duration: number;
}

const LiveStatsPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [max_chat_count, setMaxChatCount] = useState(0);
  const [max_duration, setMaxDuration] = useState(0);
  const [max_user_count, setMaxUserCount] = useState(0);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "直播课程统计";
    dispatch(titleAction("直播课程统计"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, sort, order, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .stats(id, {
        sort: sort,
        order: order,
      })
      .then((res: any) => {
        setMaxChatCount(res.data.max_chat_count);
        setMaxUserCount(res.data.max_user_count);
        setMaxDuration(res.data.max_duration);
        setList(res.data.videos);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "直播课",
      render: (_, record: any) => <span>{record.title}</span>,
    },
    {
      title: "学习人数",
      width: 200,
      defaultSortOrder: undefined,
      sorter: (a, b) => a.user_count - b.user_count,
      dataIndex: "user_count",
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <span>{record.user_count}</span>
          )}
        </>
      ),
    },
    {
      title: "聊天消息数",
      width: 200,
      defaultSortOrder: undefined,
      sorter: (a, b) => a.chat_count - b.chat_count,
      dataIndex: "chat_count",
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <span>{record.chat_count}</span>
          )}
        </>
      ),
    },
    {
      title: "直播时长",
      width: 200,
      defaultSortOrder: undefined,
      sorter: (a, b) => a.real_duration - b.real_duration,
      dataIndex: "real_duration",
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <DurationText duration={record.real_duration}></DurationText>
          )}
        </>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter: any,
    extra
  ) => {
    // console.log("params", pagination, filters, sorter, extra);
    if (sorter.order === "ascend") {
      setOrder("asc");
    } else if (sorter.order === "descend") {
      setOrder("desc");
    } else {
      setOrder("");
    }
    setSort(sorter.field);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="直播课程统计" />
      <div className="float-left mt-30">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={false}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default LiveStatsPage;
