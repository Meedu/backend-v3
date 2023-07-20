import { useState, useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { live } from "../../api/index";
import { useDispatch } from "react-redux";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";
import { AniText } from "./components/ani-text";

interface DataType {
  id: React.Key;
  created_at: string;
}

const LiveStatsPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
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
  }, [id, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .stats(id)
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
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <AniText
              value={record.user_count}
              total={max_user_count}
              type=""
            ></AniText>
          )}
        </>
      ),
    },
    {
      title: "聊天消息数",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <AniText
              value={record.chat_count}
              total={max_chat_count}
              type=""
            ></AniText>
          )}
        </>
      ),
    },
    {
      title: "直播时长",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.status === 0 || record.status === 1 ? (
            <span>-</span>
          ) : (
            <AniText
              value={record.real_duration}
              total={max_duration}
              type="time"
            ></AniText>
          )}
        </>
      ),
    },
  ];

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
        />
      </div>
    </div>
  );
};

export default LiveStatsPage;
