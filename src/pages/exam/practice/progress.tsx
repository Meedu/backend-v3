import { useState, useEffect } from "react";
import { Table } from "antd";
import { useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { practice } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment } from "../../../components";

interface DataType {
  id: React.Key;
  created_at: string;
}

const PracticeUsersProgressPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [pid, setPid] = useState(Number(result.get("pid")));

  useEffect(() => {
    document.title = "练习进度";
    dispatch(titleAction("练习进度"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setPid(Number(result.get("pid")));
  }, [result.get("id"), result.get("pid")]);

  useEffect(() => {
    getData();
  }, [id, pid, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .userProgress(id, pid)
      .then((res: any) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "章节",
      render: (_, record: any) => <span>{record.chapter_name}</span>,
    },
    {
      title: "题目数",
      width: 150,
      render: (_, record: any) => <span>{record.question_count}题</span>,
    },
    {
      title: "已练习",
      width: 150,
      render: (_, record: any) => <span>{record.submit_count}题</span>,
    },
    {
      title: "进度",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.question_count !== 0 ? (
            <span>
              {((record.submit_count * 100) / record.question_count).toFixed(2)}
              %
            </span>
          ) : (
            <span>0.00%</span>
          )}
        </>
      ),
    },
  ];

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="练习进度" />
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

export default PracticeUsersProgressPage;
